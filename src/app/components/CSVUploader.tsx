import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { loadCSVFile, ingestFromCSV, validateCSV } from '../lib/csvIngestion';
import { Transaction } from '../lib/apriori';

interface CSVUploaderProps {
  onTransactionsLoaded: (transactions: Transaction[]) => void;
  className?: string;
}

export function CSVUploader({ onTransactionsLoaded, className }: CSVUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadResult({
        success: false,
        message: 'Please upload a CSV file'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      // Load CSV content
      setUploadProgress(20);
      const csvContent = await loadCSVFile(file);

      // Validate CSV
      setUploadProgress(40);
      const validation = validateCSV(csvContent);
      if (!validation.valid) {
        setUploadResult({
          success: false,
          message: 'Invalid CSV format',
          details: { errors: validation.errors }
        });
        setIsUploading(false);
        return;
      }

      // Ingest transactions
      setUploadProgress(60);
      const transactions: Transaction[] = [];
      const result = ingestFromCSV(csvContent, (txn) => {
        transactions.push(txn);
      });

      setUploadProgress(100);

      if (result.success) {
        onTransactionsLoaded(transactions);
        setUploadResult({
          success: true,
          message: `Successfully loaded ${result.transactionsLoaded} transactions!`,
          details: {
            transactionsLoaded: result.transactionsLoaded,
            totalRevenue: result.summary.totalRevenue,
            averageBasketSize: result.summary.averageBasketSize,
            uniqueProducts: result.summary.uniqueProducts.size
          }
        });
      } else {
        setUploadResult({
          success: false,
          message: `Loaded with errors: ${result.errors.length} issues found`,
          details: { errors: result.errors.slice(0, 5) }
        });
      }

    } catch (error) {
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load CSV'
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatPhp = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className={`border-dashed border-[#2C2C2C] transition-colors duration-300 hover:bg-[#D8C3A5]/20 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          CSV Upload
        </CardTitle>
        <CardDescription>
          Upload transaction CSV files to bulk-load data into the ML engine
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload">
            <Button
              asChild
              variant="outline"
              className="w-full cursor-pointer"
              disabled={isUploading}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isUploading ? 'Processing...' : 'Select CSV File'}
              </div>
            </Button>
          </label>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-xs text-[#716A5C] text-center font-serif">
              Loading... {uploadProgress}%
            </p>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <Alert className={uploadResult.success ? 'bg-[#F4ECE1] border-[#C3AD8F]' : 'bg-[#FDF8F5] border-[#D8C3A5]'}>
            {uploadResult.success ? (
              <CheckCircle className="h-4 w-4 text-[#5E503F]" />
            ) : (
              <AlertCircle className="h-4 w-4 text-[#8A7968]" />
            )}
            <AlertDescription>
              <div className="text-[#2C2C2C]">
                <p className="font-serif font-medium">{uploadResult.message}</p>
                
                {uploadResult.success && uploadResult.details && (
                  <div className="mt-2 text-sm space-y-1 font-serif">
                    <p>• Transactions: {uploadResult.details.transactionsLoaded}</p>
                    <p>• Total Revenue: {formatPhp(uploadResult.details.totalRevenue)}</p>
                    <p>• Avg Basket Size: {uploadResult.details.averageBasketSize.toFixed(1)} items</p>
                    <p>• Unique Products: {uploadResult.details.uniqueProducts}</p>
                  </div>
                )}
                
                {!uploadResult.success && uploadResult.details?.errors && (
                  <div className="mt-2 text-sm font-serif">
                    <p className="font-medium">Errors:</p>
                    <ul className="list-disc list-inside">
                      {uploadResult.details.errors.map((error: string, i: number) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* CSV Format Info */}
        <div className="bg-[#FAF8F5] border border-[#EBE4D5] rounded-lg p-3 text-sm">
          <p className="font-serif font-medium text-[#2C2C2C] mb-1">CSV Format:</p>
          <p className="text-[#716A5C] text-xs mb-2 font-serif">
            Upload your transaction CSV files (transactions_A.csv or transactions_B.csv).
            Each row should contain comma-separated product names.
          </p>
          <div className="bg-white border border-[#EBE4D5] rounded p-2 text-xs font-mono mb-2 text-[#4A4A4A]">
            <div className="text-[#8C7A6B] italic">items</div>
            <div>Red-Love</div>
            <div>"Matchstick-Jar,Rose-Scent"</div>
            <div>"Green-Wealth,Eucalyptus-Scent,Gold-Success"</div>
          </div>
          <p className="text-xs text-[#5E503F] font-serif font-medium">
            📁 Use the provided transactions_A.csv or transactions_B.csv files
          </p>
        </div>
      </CardContent>
    </Card>
  );
}