import { fetchHomeListing } from "@/shared/api/methods/catalog.methods";

export const homeService = {
  fetchListingData() {
    return fetchHomeListing();
  },
};
