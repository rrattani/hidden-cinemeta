/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import DownloadBackup from '@/components/DownloadBackup'
import Info from '@/components/Info';
import { toast } from 'react-hot-toast'
import CopyClipboard from '@/components/CopyClipboard';
import Navbar from '@/components/Navbar';
import { useForm } from 'react-hook-form';
import { SimpleCatalog, updateAddons } from '@/utils/catalog';
import UploadBackup from '@/components/UploadBackup';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const stremioAPIBase = "https://api.strem.io/api/";

type PageSetup = "hide" | "restore";

export default function Home() {
  const { width, height } = useWindowSize()
  const [stremioAuthKey, setStremioAuthKey] = useState('');
  const [addons, setAddons] = useState([]);
  const [updatedAddons, setUpdatedAddons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState<SimpleCatalog[]>([]);
  const [pageMode, setPageMode] = useState<PageSetup>("hide");
  const [syncStatus, setSyncStatus] = useState(false)

  function getCatalogKey(catalog: SimpleCatalog): string {
    return `${catalog.id}_${catalog.type}_${catalog.name}`;
  }

  const [hiddenItems, setHiddenItems] = useState<SimpleCatalog[]>([]);
  const { handleSubmit } = useForm();

  // Handle hide/show field toggling
  const handleCheckboxChange = (catalog: SimpleCatalog) => {
    // We are setting the hiddenItems value
    setHiddenItems((prevHiddenItems) =>
      // We are checking if the value is already hidden
      prevHiddenItems.some(
        (item) =>
          item.id === catalog.id &&
          item.type === catalog.type &&
          item.name === catalog.name // Check all 3 values
      )
        // If already hidden, then filter out the entry and update hidden items state
        ? prevHiddenItems.filter(
          (item) =>
            !(item.id === catalog.id && item.type === catalog.type && item.name === catalog.name) // Unhide by matching all 3 values
        )
        // If not hidden already, then add it to state
        : [...prevHiddenItems, catalog] // Hide the catalog
    );
  };

  // Handle form submission
  const onHideFormSubmit = () => {
    console.log('Hidden Items', hiddenItems)
    const processedAddons = updateAddons(addons, hiddenItems)
    setUpdatedAddons(processedAddons)
    console.log("Updated add-ons", processedAddons)
    // TODO: At some point reset hiddenItems and Catalogs
  };

  const extractValidCatalogs = useCallback((addons: any[]) => {
    // TODO: Better validation
    const cinemetaAddon = addons.find(addon => addon.manifest.id === "com.linvo.cinemeta");

    if (!cinemetaAddon) {
      toast.error("Cinemeta Addon not found in list!");
      return; // Exit early if the addon is not found
    }

    const validCatalogs: SimpleCatalog[] = cinemetaAddon.manifest.catalogs
      .filter((catalog: any) => catalog.id !== "last-videos" && catalog.id !== "calendar-videos" && catalog.id !== "year")
      .map((catalog: any) => ({
        name: catalog.name,
        id: catalog.id,
        type: catalog.type
      }));

    setCatalogs(validCatalogs);
  }, []);

  // Anytime we add entries to addons list, ensure we have also extracted valid catalogs
  useEffect(() => {
    if (addons.length > 0) {
      extractValidCatalogs(addons);
    }
  }, [addons, extractValidCatalogs]);

  // For Debugging
  useEffect(() => {
    console.log("Update to catalogs", catalogs)
  }, [catalogs])

  useEffect(() => {
    console.log("Update to hidden items", hiddenItems)
  }, [hiddenItems])

  useEffect(() => {
    console.log("Update to updated addons", updatedAddons)
  }, [updatedAddons])


  const loadUserAddons = async () => {
    if (!stremioAuthKey) {
      console.error('No auth key provided');
      toast.error('No auth key provided :(');
      return;
    }

    setLoading(true);

    toast.promise(
      fetch(`${stremioAPIBase}addonCollectionGet`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'AddonCollectionGet',
          authKey: stremioAuthKey,
          update: true,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.result && data.result.addons) {
            setAddons(data.result.addons);
            console.log('Add-ons loaded:', data.result.addons);
          } else {
            return Promise.reject('Failed to load add-ons')
          }
        }),
      {
        loading: 'Loading add-ons...',
        success: <b>Add-ons loaded successfully!</b>,
        error: <b>Failed to load add-ons.</b>,
      }
    )
      .catch((error) => {
        console.error('Error fetching add-ons:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const syncUserAddons = async () => {
    if (!stremioAuthKey) {
      console.error('No auth key provided');
      toast.error('No auth key provided :(');
      return;
    }

    setLoading(true);

    toast.promise(
      fetch(`${stremioAPIBase}addonCollectionSet`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'AddonCollectionSet',
          authKey: stremioAuthKey,
          addons: updatedAddons, // Using updatedAddons
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.result && data.result.success) {
            console.log('Add-ons synced successfully');
            setSyncStatus(true); // Added this line
          } else {
            return Promise.reject('Failed to sync add-ons');
          }
        }),
      {
        loading: 'Syncing add-ons...',
        success: <b>Add-ons synced successfully!</b>,
        error: <b>Failed to sync add-ons.</b>,
      }
    )
      .catch((error) => {
        console.error('Error syncing add-ons:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (syncStatus) {
    console.log('Sync status is true, rendering confetti...');
  }

  const currentTitle = pageMode === "hide" ? "A Utility to Hide Cinemeta Catalogs in Stremio" : "A Utility to Restore Stremio Add-ons via Backup File"

  const currentDescription = pageMode === "hide" ? `A wise man once said, "Cinemeta catalogs are ugly"... and he was absolutely right.` : `A wise man once said "Backups are a good idea"... and he was RIGHT`

  return (
    <div className="flex flex-col w-full items-center">
      <Navbar pageMode={pageMode} setPageMode={setPageMode} addonsLength={updatedAddons.length} />
      <div className="pt-2 w-full max-w-2xl text-wrap text-white flex justify-center px-10">
        <div className="flex flex-col items-center space-y-8">
          {/* Title Section */}
          <div className="flex flex-col items-center text-center space-y-4 ">
            <p className="text-2xl font-bold">{currentTitle}</p>
            <blockquote className="text-gray-500 text-sm italic font-semibold">
              <p>{currentDescription}</p>
            </blockquote>
          </div>
          <div className="divider"></div>
          {/* Hide and Restore - Step 1. AuthKeyStep */}
          {addons.length === 0 && (
            <div className="flex flex-col space-y-4">
              <h2 className="font-bold text-xl">Step 1: Get Stremio Authentication Key</h2>
              <ol className="space-y-4 list-disc">
                <li>
                  Login to <a target="_blank" href="https://web.stremio.com/ " className="link" rel="noopener noreferrer">https://web.stremio.com/</a> using your Stremio credentials in your browser (Chrome Preferred).
                </li>
                <li>
                  {"Open the developer console (F12 or right click page and click 'Inspect'), go to the 'Console' tab."}
                </li>
                <li>
                  Paste the follow code snippet into the console and press enter:
                  <CopyClipboard>{"JSON.parse(localStorage.getItem(\"profile\")).auth.key"}</CopyClipboard>
                </li>
                <li>
                  It should print out a code. Copy the value (leave out the quotation marks) and paste into the box below and press enter
                </li>
              </ol>
              <div className="space-x-2 flex flex-row justify-center flex-wrap">
                <input
                  type="text"
                  placeholder="Enter Stremio Auth Key"
                  className="input input-bordered max-w-xs truncate"
                  value={stremioAuthKey}
                  onChange={(e) => setStremioAuthKey(e.target.value)}
                />
                <button className="btn btn-primary" onClick={loadUserAddons} disabled={loading}>
                  {loading ? 'Loading Add-ons...' : 'Load Add-ons'}
                </button>
              </div>
            </div>
          )}
          {/* Hide - Step 2. Configuration Step */}
          {(addons.length !== 0 && catalogs.length !== 0 && updatedAddons.length === 0) && (pageMode === "hide") && (
            <div className="flex flex-col space-y-2">
              <h2 className="font-bold text-xl">Step 2: Select which catalogs to no longer show</h2>
              <ol className="space-y-4 list-disc ml-4">
                <li><b>[OPTIONAL]</b>: This is a good time to make a back-up, click the button below to download your current add-ons configuration to your computer
                </li>
                <li>
                  Note: You can restore your add-ons from the backup file by switching modes at the top of the page
                </li>
                <div className="flex justify-center">
                  <DownloadBackup data={addons} fileName={`stremio-addons-backup-${new Date().toISOString().slice(0, 10)}`} />
                </div>
                <li>
                  Choose from the catalogs listed below (have excluded non-visual catalogs used for Stremio core functionality)
                </li>
              </ol>
              {/* Form to Pick Catalogs to Hide */}
              <div className="p-4">
                <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmit(onHideFormSubmit)}>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      {/* head */}
                      <thead>
                        <tr>
                          <th></th>
                          <th>ID</th>
                          <th>Type</th>
                          <th>Name</th>
                          <th>Hide?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catalogs.map((catalog, key) => (
                          <tr key={getCatalogKey(catalog)}>
                            <th>{key + 1}</th>
                            <td>{catalog.id}</td>
                            <td>{catalog.type}</td>
                            <td>{catalog.name}</td>
                            <td><input type="checkbox" className="checkbox" onChange={() => handleCheckboxChange(catalog)} checked={hiddenItems.includes(catalog)} /></td>
                          </tr>

                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="submit" className="btn btn-primary">Apply Changes</button>
                </form>
              </div>
            </div>
          )}
          {/* Restore: Step 2: Upload file */}
          {(addons.length !== 0 && catalogs.length !== 0 && updatedAddons.length === 0) && (pageMode === "restore") && (
            <div className="flex flex-col space-y-2">
              <h2 className="font-bold text-xl">Step 2: Select the backup file to restore your account to</h2>
              <ol className="space-y-4 list-disc ml-4">
                <li>
                  If you already made a backup on this page and wanted to restore your stremio account to that backup, simply select the backup file in the input below and press apply changes
                </li>
              </ol>
              {/* Form to Pick Catalogs to Hide */}
              <div className="p-4">
                <UploadBackup setBackupData={setUpdatedAddons} />
              </div>
            </div>
          )}
          {/* After Update */}
          {updatedAddons.length !== 0 && (
            <div className="flex flex-col space-y-2">
              <h2 className="font-bold text-xl">{`Step 3: Sync Changes to Stremio's Servers`}</h2>
              {!syncStatus ? (
                <>
                  <ol className="space-y-4 list-disc ml-4">
                    <li>
                      Press the button below to apply your selected changes
                    </li>
                    <li>
                      As a reminder, recommend to save a backup in the previous step. You can reload this page to restart the process.
                    </li>
                  </ol>
                  {/* Button to Sync Changes to Stremio */}
                  <div className="p-4 w-full flex flex-col items-center">
                    <button className="btn btn-primary" onClick={syncUserAddons}>
                      Sync Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {syncStatus && (
                    <Confetti
                      style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
                      width={width}
                      height={height}
                    />
                  )}
                  <div>Congrats! Changes are made successfully!</div>
                </>
              )}
            </div>
          )}
          <div className="divider"></div>
          <Info />
        </div>
      </div>
    </div>
  );
}



