/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

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
  description: "Restore your stremio account using a backup file"
}]

const Navbar: React.FC<NavbarProps> = ({ setPageMode, pageMode, addonsLength }) => {

  const currentMode = modes.filter(mode => mode.id === pageMode);

  return (
    <div className="navbar bg-base-100 max-w-2xl">
      <div className="flex-1">
        <a className="text-xl">hidden cinemeta</a>
      </div>
      <div className="flex-none">
        {addonsLength === 0 && (

          <div className="dropdown dropdown-hover">
            Mode:{" "}
            <div tabIndex={0} role="div" className="btn btn-sm m-1">{currentMode[0].prefix}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              {modes.map(mode => {
                return (
                  <li key={mode.id} onClick={() => setPageMode(mode.id)}>
                    <a>
                      <b>{mode.prefix}:</b> {mode.description}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
