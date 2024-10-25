/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface NavbarProps {
  pageMode: "hide" | "restore"
  setPageMode: React.Dispatch<React.SetStateAction<any>>;
  addonsLength: number
}

const modes = [{
  id: "hide",
  name: "Hide Cinemeta Catalogs",
  prefix: "Hide",
  description: "Select Cinemeta catalogs to hide"
},
{
  id: "restore",
  name: "Restore Stremio Addons",
  prefix: "Restore",
  description: "Restore stremio addons using a backup file"
}]

const icons = {
  hide: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>,
  restore: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>


}

const Navbar: React.FC<NavbarProps> = ({ setPageMode, pageMode, addonsLength }) => {

  const [openDropdown, setOpenDropdown] = useState(false)
  const currentMode = modes.filter(mode => mode.id === pageMode);

  return (
    <div className="px-10 navbar bg-base-100 max-w-2xl">
      <div className="flex-1">
        <a className="invisible sm:visible text-xl">hidden cinemeta</a>
      </div>
      <div className="flex-none">
        {addonsLength === 0 && (

          <div className="dropdown dropdown-hover dropdown-end">
            Mode:{" "}
            <div tabIndex={0} role="div" className="btn btn-sm m-1" onClick={() => {
              setOpenDropdown(true)
            }}>{currentMode[0].prefix}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow" id="dropdown" onMouseLeave={() => {
              setOpenDropdown(false)
            }}>
              {openDropdown && modes.map(mode => {
                return (
                  <button onClick={() => {
                    if (pageMode !== mode.id) {
                      setPageMode(mode.id)
                      toast.success(`Switched to ${mode.prefix} mode`)
                      setOpenDropdown(false)
                    }
                  }} key={mode.id} id={mode.id} className="flex flex-col items-center p-4 space-y-1 outline outline-2  outline-base-300 bg-base-200 hover:bg-base-100 text-white rounded-lg">
                    {mode.id === "hide" ? icons.hide : icons.restore}
                    <span className="font-bold">{mode.name}</span>
                    <span className="text-sm text-gray-200 text-center">{mode.description}</span>
                  </button>
                )
              })}
              {/* <li key={mode.id} onClick={() => { */}
              {/*   setPageMode(mode.id) */}
              {/*   toast.success(`Switched to ${mode.prefix} mode`) */}
              {/* }}> */}
              {/*   <a> */}
              {/*     <b>{mode.prefix}:</b> {mode.description} */}
              {/*   </a> */}
              {/* </li> */}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
