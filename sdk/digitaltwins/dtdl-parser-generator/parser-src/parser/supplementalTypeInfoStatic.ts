// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { SupplementalTypeCollectionImpl } from "./supplementalTypeCollectionImpl";

export class SupplementalTypeInfoStatic {
  public static supplementalTypeCollection: SupplementalTypeCollectionImpl =
    new SupplementalTypeCollectionImpl();

  public static retrieveSupplementalTypeCollection(): SupplementalTypeCollectionImpl {
    return this.supplementalTypeCollection;
  }
}
