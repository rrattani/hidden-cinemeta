import toast from "react-hot-toast";

interface DownloadJSONProps {
  data: object;
  fileName: string;
}

const DownloadBackup: React.FC<DownloadJSONProps> = ({ data, fileName }) => {
  const downloadJSON = () => {
    const jsonData = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const jsonURL = URL.createObjectURL(jsonData);
    const link = document.createElement('a');
    link.href = jsonURL;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloading backup file!")
  };

  return (
    <button className="btn btn-secondary" onClick={downloadJSON}>Download Backup</button>
  );
};

export default DownloadBackup;
