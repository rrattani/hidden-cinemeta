interface CodeProps {
  children: React.ReactNode;
}

const Code: React.FC<CodeProps> = ({ children }) => {
  return (
    <span className="break-all text-sm bg-gray-600 text-white font-mono p-1 rounded-xl">
      {children?.toString()}
    </span>
  );
}

export default Code;


