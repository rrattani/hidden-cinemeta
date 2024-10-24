/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from 'react-hot-toast';

interface UploadBackupProps {
  setBackupData: React.Dispatch<React.SetStateAction<any>>,
}


const UploadBackup: React.FC<UploadBackupProps> = ({ setBackupData }) => {

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsedData = JSON.parse(result);
        setBackupData(parsedData);
        toast.success("Backup file uploaded successfully!");
      } catch (error) {
        toast.error("Failed to parse JSON file.");
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept="application/json" onChange={handleFileUpload} />
      {/* {backupData && <pre>{JSON.stringify(backupData, null, 2)}</pre>} */}
    </div>
  );
};

export default UploadBackup;
