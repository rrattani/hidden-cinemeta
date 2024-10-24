import Code from "./Code"

const Info = () => {
  return (
    <div className="bg-gray-900 p-3 rounded-xl space-y-4">
      <h1 className="text-xl font-bold mb-2 mt-2 ml-1">Frequently Asked Questions:</h1>
      <div className="collapse collapse-plus bg-gray-800">
        <input type="radio" name="my-accordion-3" defaultChecked />
        <div className="collapse-title font-bold">Who is this for?</div>
        <div className="collapse-content">
          <p>For users looking to remove Cinemeta catalogs from the Board and Discover pages in Stremio while keeping them available in search results, this workaround provides an effective solution.</p>
        </div>
      </div>
      <div className="collapse collapse-plus bg-gray-800">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-bold">How does it work?</div>
        <div className="collapse-content space-y-4">
          <p>Largely uses the same approach as {" "}
            <a target="_blank" href="https://stremio-addon-manager.vercel.app/" className="link" rel="noopener noreferrer">
              Stremio Addon Manager
            </a>
          </p>
          <p>This uses the Stremio API behind the scenes. Specifically the <Code>addonCollectionSet</Code> and <Code>addonCollectionGet</Code> endpoints.
          </p>
          <p>
            They are documented in detail here: {" "}
            <a target="_blank" href="https://github.com/Stremio/stremio-addon-sdk/tree/master/docs/api" className="link" rel="noopener noreferrer">
              Stremio API Documentation
            </a>
          </p>
        </div>
      </div>
      <div className="collapse collapse-plus bg-gray-800">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-bold">Is it safe?</div>
        <div className="collapse-content space-y-4">
          <p>This is more a work-around than an official solution so your mileage may vary. In my own testing it appears to work without issue.</p>
          <p>
            Check-out the source code here: {" "}
            <a target="_blank" href="https://github.com/Skarian/hidden-cinemeta" className="link" rel="noopener noreferrer">
              Github Repository
            </a>
          </p>
          <p>
            If you have any issues try to leave a comment in the Reddit announcement post in the /r/StremioAddons page {" "}
            <a target="_blank" href="" className="link" rel="noopener noreferrer">
              Reddit Post
            </a>
          </p>
        </div>
      </div>
      {/* What are these "modes"? */}
      <div className="collapse collapse-plus bg-gray-800">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-bold">What are these modes?</div>
        <div className="collapse-content space-y-4">
          <p>
            {`Near the top of the page there is a button where you can pick which mode this page is in.`}
          </p>
          <p>
            {`"Hide" mode will let you make and download a backup of your current addons as well as hide Cinemeta Catalogs from your board and discover pages in Stremio`}
          </p>
          <p>
            {`"Restore" mode will let you restore your stremio addons based on the backup file that was created`}
          </p>
        </div>
      </div>
      {/* Why just hide? */}
      <div className="collapse collapse-plus bg-gray-800">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-bold">Why hide Cinemeta Catalogs instead of removing Cinemeta</div>
        <div className="collapse-content space-y-4">
          <p>
            {`From what I can gather, Cinemeta is a core add-on for Stremio's functionality. Removing it breaks things.`}
          </p>
          <p>
            {`By only hiding we can avoid many potential issues`}
          </p>
        </div>
      </div>

      {/* How do Backups work? */}
      <div className="collapse collapse-plus bg-gray-800">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-bold">How do backups work?</div>
        <div className="collapse-content space-y-4">
          <p>
            {`In "hide" mode, during step 2 you will have the opportunity to save your current add-ons to a backup file that you can tuck away in a safe place`}
          </p>
          <p>
            {`If you ever want to restore your addons to that backup, simply select "Restore" in the mode option near the top of the page and follow the steps`}
          </p>
        </div>
      </div>

    </div>
  )
}

export default Info
