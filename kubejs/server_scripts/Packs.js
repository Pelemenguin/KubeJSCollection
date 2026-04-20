const PelemenguinPacks = {};

const KubeJSDependency = PackGen.createDependency("optional", "kubejs")
    .withOrdering("before")
    .build();

PackGen.createMetaData("component_stylizer")
    .withName("Component Stylizer")
    .withAuthors(["Pelemenguin"])
    .withVersion("1.0")
    .addDependency(KubeJSDependency)
    .build();

PelemenguinPacks.RegCmd = PackGen.createMetaData("regcmd")
    .withName("RegCmd")
    .withAuthors(["Pelemenguin"])
    .withVersion("1.0.1")
    .addDependency(KubeJSDependency)
    .withDescription("A KubeJS library for registering commands more easily.")
    .build();

ModGen.createModInfo("regcmd", PelemenguinPacks.RegCmd)
    .withAuthors("Pelemenguin")
    .withLicense("MIT")
    .withVersion("1.0.1")
    .withDescription("A KubeJS library for registering commands more easily.")
    .build();

PackGen.createMetaData("zinchronize")
    .withAuthors(["Pelemenguin"])
    .withName("Zinchrnoize")
    .withVersion("1.0")
    .addDependency(KubeJSDependency)
    .withDescription("[PLACEHOLDER]")
    .build();

PackGen.createMetaData("fastjs")
    .withAuthors(["Pelemenguin"])
    .withName("FastJS")
    .withVersion("1.0")
    .addDependency(KubeJSDependency)
    .withDescription("[PLACEHOLDER]")
    .build();

PelemenguinPacks.EnumJS = PackGen.createMetaData("enumjs")
    .withAuthors(["Pelemenguin"])
    .withName("EnumJS")
    .withVersion("1.1")
    .addDependency(KubeJSDependency)
    .withDescription("A KubeJS library for creating Java enums.")
    .build();

ModGen.createModInfo("enumjs", PelemenguinPacks.EnumJS)
    .withAuthors("Pelemenguin")
    .withLicense("MIT")
    .withVersion("1.1")
    .withDescription("A KubeJS library for creating Java enums.")
    .build();

PelemenguinPacks.LavaAdapter = PackGen.createMetaData("lava_adapter")
    .withAuthors(["Pelemenguin"])
    .withName("LavaAdapter")
    .withVersion("1.1")
    .addDependency(KubeJSDependency)
    .withDescription("A KubeJS library for extending Java classes or implementing Java interfaces.")
    .build();

ModGen.createModInfo("lava_adapter", PelemenguinPacks.LavaAdapter)
    .withAuthors("Pelemenguin")
    .withLicense("MIT")
    .withVersion("1.0")
    .withDescription("A KubeJS library for extending Java classes or implementing Java interfaces.")
    .build();

// ===== DEPRECATED ===== //
// PackGen.createMetaData("multithreadic")
//     .withName("MultiThreadic")
//     .withAuthors(["Pelemenguin"])
//     .withVersion("1.0")
//     .addDependency(
//         PackGen.createDependency("optional", "kubejs")
//             .withOrdering("before")
//             .build()
//     )
//     .build();
// ====================== //
