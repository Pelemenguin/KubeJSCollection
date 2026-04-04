// priority: 2147483647

/// <reference path="ComponentStylizer.d.ts" />

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

//#region - Load Java Classes

const $StringBuilder  = Java.loadClass("java.lang.StringBuilder");

const $ChatFormatting = Java.loadClass("net.minecraft.ChatFormatting");
const $Style          = Java.loadClass("net.minecraft.network.chat.Style");

//#endregion

//#region - Lazy Component

/** @type {typeof ComponentStylizer.LazyComponent} */
let LazyComponentClass = function (component, stylizer) {
    this.cachedString = undefined;
    this.cachedResult = undefined;
    this.rawComponent = component;
    this.stylizer = stylizer;
}

/** @type {ComponentStylizer.LazyComponent} */
LazyComponentClass.prototype = {
    get: function () {
        let curString = this.rawComponent.getString();
        if (curString != this.cachedString || this.cachedResult == undefined) {
            this.cachedResult = this.stylizer.transform(curString);
            this.cachedString = curString;
        }
        return this.cachedResult;
    },
    clearCache: function () {
        this.cachedResult = undefined;
        this.cachedString = undefined;
    },
    refreshAndGet: function () {
        let str = this.rawComponent.getString();
        this.cachedResult = this.stylizer.transform(str);
        this.cachedString = str;
        return this.cachedResult;
    }
};

LazyComponentClass.of = function (component, stylizer) {
    return new LazyComponentClass(component, stylizer);
}

//#endregion

//#region - Abstract Stylizer

/** @type {typeof ComponentStylizer.Stylizer} */
let StylizerClass = function () {
    throw new Error("Stylizer is an abstract class and cannot be instantiated directly.");
};

/** @type {ComponentStylizer.Stylizer["transform"]} */
StylizerClass.prototype.transform = function (text) {
    throw new Error("Method 'transform' must be implemented by subclasses of Stylizer.");
};
/** @type {ComponentStylizer.Stylizer["literal"]} */
StylizerClass.prototype.literal = function (text) {
    return LazyComponentClass.of(
        Component.literal(text),
        this
    );
};
/** @type {ComponentStylizer.Stylizer["translatable"]} */
StylizerClass.prototype.translatable = function(key, _objects) {
    // `objects` is actually a rest parameters, but Rhino do not support that
    let args = [];
    // if `objects` is a single array, use that array directly
    if (arguments.length == 2 && Array.isArray(_objects)) {
        args = _objects;
    } else {
        for (let i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
    }
    return LazyComponentClass.of(
        Component.translatable(key, args),
        this
    );
}

//#endregion

//#region - Stylizer Implementations

/** @type {typeof ComponentStylizer.Emphasizer} */
let EmphasizerClass = function () {
    this.defaultStyle = $Style.EMPTY;
    this.emphStyle = $Style.EMPTY.withBold(true);
    this.emphCharacter = "_";
};

Object.setPrototypeOf(EmphasizerClass.prototype, StylizerClass.prototype);

/** @type {ComponentStylizer.Emphasizer["transform"]} */
EmphasizerClass.prototype.transform = function (text) {
    text = "" + text; // There is a chance that the text could be a Java string, where `length` is a method
    if (text.length == 0) {
        return Component.literal(text);
    }
    let result = Component.literal("");
    let isEmph = false;
    let curIndex = 0;
    let curBuilder = new $StringBuilder();
    while (curIndex < text.length) {
        let cur = text.charAt(curIndex);
        if (cur == "\\") {
            if (curIndex < text.length - 1) {
                curBuilder.append(text.charAt(curIndex + 1));
                curIndex += 2;
            }
        } else if (cur == this.emphCharacter) {
            let style = isEmph ? this.emphStyle : this.defaultStyle;
            result.append(Component.literal(curBuilder.toString()).setStyle(style));
            curBuilder.setLength(0);
            isEmph = !isEmph;
            curIndex++;
        } else {
            curBuilder.append(cur);
            curIndex++;
        }
    }
    if (curBuilder.length() > 0) {
        let style = isEmph ? this.emphStyle : this.defaultStyle;
        result.append(Component.literal(curBuilder.toString()).setStyle(style));
    }
    return result;
};
/** @type {ComponentStylizer.Emphasizer["setEmphStyle"]} */
EmphasizerClass.prototype.setEmphStyle = function (style) {
    this.emphStyle = style;
    return this;
};
/** @type {ComponentStylizer.Emphasizer["setDefaultStyle"]} */
EmphasizerClass.prototype.setDefaultStyle = function (style) {
    this.defaultStyle = style;
    return this;
};

EmphasizerClass.create = function(emphStyle, defaultStyle) {
    let created = new EmphasizerClass();
    if (emphStyle != undefined) {
        created.setEmphStyle(emphStyle);
    }
    if (defaultStyle != undefined) {
        created.setDefaultStyle(defaultStyle);
    }
    return created;
}

//#endregion

/** @type {typeof ComponentStylizer} */
const exported = {
    LazyComponent: LazyComponentClass,
    Stylizer: StylizerClass,
    Emphasizer: EmphasizerClass,
    Style: $Style,
    ChatFormatting: $ChatFormatting,
};

return exported;

})();
