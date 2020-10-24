/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/

import "@lwc/synthetic-shadow"

import DemoMain from "demo/main";
import CommerceHome from "commerce/homeMain";

customElements.define("demo-main", DemoMain.CustomElementConstructor);
customElements.define("commerce-home", CommerceHome.CustomElementConstructor);
