// copyright (c) microsoft corporation.
// Licensed under the MIT license.

/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { SupplementalTypeCollectionImpl } from "./supplementalTypeCollectionImpl";

export class ModelParserStatic {
  // codegen-outline-begin methods
  static supplementalTypeCollection: SupplementalTypeCollectionImpl =
    new SupplementalTypeCollectionImpl();

  static retrieveSupplementalTypeCollection(): SupplementalTypeCollectionImpl {
    return this.supplementalTypeCollection;
  }
  // codegen-outline-end
}
