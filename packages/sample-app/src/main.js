/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/

//import "@lwc/synthetic-shadow"

/* eslint-disable no-undef */
import { register } from "lwc";

// The wire service has to be registered once
import { registerWireService } from 'wire-service';
registerWireService(register)

// Import this web components to get them loaded and registered
import Main from "app/mainlayout";

// Enable one of these with sto test the slot propagation
// Also add for the second on synthetic shadow (as synthetic shadow does yet work with light DOM, the page is simplified)
//import Main from "slots/main";
//import Main from "slots/mainSynthetic";
