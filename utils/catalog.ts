
export interface SimpleCatalog {
  name: string,
  id: string,
  type: string
}

interface ExtraEntry {
  name: string;
  isRequired?: boolean;
  [key: string]: any;
}

interface Catalog {
  name: string;
  id: string;
  type: string;
  extra?: ExtraEntry[];
  extraSupported?: string[];
  [key: string]: any;
}

interface Manifest {
  id: string;
  catalogs?: Catalog[];
  [key: string]: any;
}

interface Addon {
  manifest: Manifest;
  [key: string]: any;
}

export function updateAddons(addons: any[], hiddenItems: Catalog[]): any[] {
  return addons.map((addon: Addon) => {
    if (addon.manifest.id === "com.linvo.cinemeta") {
      const updatedCatalogs = addon.manifest.catalogs?.map((catalog: Catalog) => {
        const isHidden = hiddenItems.some(
          (hiddenItem) =>
            hiddenItem.name === catalog.name &&
            hiddenItem.id === catalog.id &&
            hiddenItem.type === catalog.type
        );

        let updatedExtra = catalog.extra ? [...catalog.extra] : [];
        let updatedExtraSupported = catalog.extraSupported ? [...catalog.extraSupported] : [];

        const extraSearchIndex = updatedExtra.findIndex((entry) => entry.name === "search");

        if (isHidden) {
          // Catalog is in hiddenItems
          if (extraSearchIndex >= 0) {
            // 'search' entry exists
            if (updatedExtra[extraSearchIndex].isRequired !== true) {
              updatedExtra[extraSearchIndex] = {
                ...updatedExtra[extraSearchIndex],
                isRequired: true,
              };
            }
          } else {
            // 'search' entry does not exist, add it
            updatedExtra.push({ name: "search", isRequired: true });
          }

          // Ensure 'search' is in catalog.extraSupported
          if (!updatedExtraSupported.includes("search")) {
            updatedExtraSupported.push("search");
          }
        } else {
          // Catalog is not in hiddenItems
          if (extraSearchIndex >= 0) {
            // 'search' entry exists
            if (updatedExtra[extraSearchIndex].hasOwnProperty('isRequired')) {
              const { isRequired, ...rest } = updatedExtra[extraSearchIndex];
              updatedExtra[extraSearchIndex] = rest;
            }
          }
          // Optionally remove 'search' from extraSupported if not needed
          // This can be handled if required
        }

        return {
          ...catalog,
          extra: updatedExtra,
          extraSupported: updatedExtraSupported,
        };
      }) ?? addon.manifest.catalogs;

      return {
        ...addon,
        manifest: {
          ...addon.manifest,
          catalogs: updatedCatalogs,
        },
      };
    }
    // Return other add-ons untouched
    return addon;
  });
}
