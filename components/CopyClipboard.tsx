import CopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-hot-toast'
import Code from './Code'

interface CopyClipboardProps {
  children: React.ReactNode
}

const CopyClipboard: React.FC<CopyClipboardProps> = ({ children }) => {
  if (!children) return null;
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-wrap p-2 rounded-lg space-x-2 justify-center">
        <div className="truncate">
          <Code>{children}</Code>
        </div>
        <CopyToClipboard onCopy={() => {
          toast.success("Copied to Clipboard!")
        }} text={children?.toString()}>
          <button className="btn btn-primary btn-xs">Copy</button>
        </CopyToClipboard>
      </div>
    </div>
  )
}

export default CopyClipboard
