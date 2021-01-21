/*
 * Copyright 2020, The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getWMPropertiesForDisplay,  shortenName } from '../mixin'
import { asRawTreeViewObject } from '../../utils/diff.js'
import { DisplayArea } from "../common"
import WindowContainer from "./WindowContainer"

DisplayArea.fromProto = function (proto, isActivityInTree: Boolean): DisplayArea {
    if (proto == null) {
        return null
    } else {
        const windowContainer = WindowContainer.fromProto({proto: proto.windowContainer, nameOverride: proto.name})
        if (windowContainer == null) {
            throw "Window container should not be null: " + JSON.stringify(proto)
        }
        const entry = new DisplayArea(proto.isTaskDisplayArea, windowContainer)

        proto.windowContainer.children.reverse()
            .map(it => WindowContainer.childrenFromProto(entry, it, isActivityInTree))
            .filter(it => it != null)
            .forEach(it => windowContainer.childContainers.push(it))

        entry.obj = getWMPropertiesForDisplay(proto)
        entry.shortName = shortenName(entry.name)
        entry.children = entry.childrenWindows
        entry.rawTreeViewObject = asRawTreeViewObject(entry)
        return entry
    }
}

export default DisplayArea