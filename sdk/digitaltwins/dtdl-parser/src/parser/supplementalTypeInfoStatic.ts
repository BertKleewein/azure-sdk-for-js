// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { SupplementalTypeCollectionImpl } from "./supplementalTypeCollectionImpl";

export class SupplementalTypeInfoStatic {
  static supplementalTypeCollection: SupplementalTypeCollectionImpl = new SupplementalTypeCollectionImpl();

  static retrieveSupplementalTypeCollection(): SupplementalTypeCollectionImpl {
    return this.supplementalTypeCollection;
  }
}
