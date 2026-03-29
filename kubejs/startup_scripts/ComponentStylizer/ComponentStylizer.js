// priority: 2147483647

/** @type {ComponentStylizer} */
const ComponentStylizer = (() => {

//#region - Bypass Class Filter

const $NativeJavaClass = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");
const $KubeJS = Java.loadClass("dev.latvian.mods.kubejs.KubeJS");
const $Context = Java.loadClass("dev.latvian.mods.rhino.Context");
const context = $Context.enter();
const scope = {};

/** @type {Internal.Method} */
const $Class_forName = Java.getClass().getClass().getMethod("forName", Java.loadClass("java.lang.String"));

/**
 * @param {string} className 
 * @returns {typeof any}
 */
const loadSpecial = (className) => {
    return new $NativeJavaClass(context, scope, $Class_forName.invoke(null, className));
}

//#endregion

const $ArrayDeque = Java.loadClass("java.util.ArrayDeque");

//#region - Load Java Classes

const $Style = Java.loadClass("net.minecraft.network.chat.Style");

//#endregion

//#region - Helper parser



//#endregion

//#region - ComponentStylizer Implementation

/** @type {typeof Internal.pelemenguin$ComponentStylizer.Emphasizer} */
let EmphasizerClass = function () {
    this.defaultStyle = $Style.EMPTY;
    this.emphStyle = $Style.EMPTY.withBold(true);
    this.emphCharacter = "_";
};

/** @type {Internal.pelemenguin$ComponentStylizer.Emphasizer} */
EmphasizerClass.prototype = {
    transform: function (input) {
        let rawString = input.getString();
        if (rawString.length() == 0) {
            return Component.literal(rawString);
        }
        let result = Component.literal("");
        let isEmph = false;
        let curIndex = 0;
        while (curIndex < rawString.length()) {
            let nextSymb = rawString.indexOf(this.emphCharacter, curIndex);
            let part;
            if (nextSymb == -1) {
                part = rawString.substring(curIndex);
            } else {
                part = rawString.substring(curIndex, nextSymb);
            }
            let child = Component.literal(part).setStyle(isEmph ? this.emphStyle : this.defaultStyle);
            result.append(child);
            isEmph = !isEmph;
            if (nextSymb == -1) {
                break;
            } else {
                curIndex = nextSymb + 1;
            }
        }
        return result;
    }
};

//#endregion

/** @type {ComponentStylizer} */
const exported = {
    Emphasizer: EmphasizerClass
};

})();
