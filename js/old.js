// Inicial
function initMap() {
    require([
        // ArcGIS
        "esri/config",
        "esri/Map",
        "esri/Basemap",
        "esri/views/MapView",
        "esri/Graphic",

        // Core
        "esri/core/Collection",
        "esri/core/watchUtils",
        "esri/core/lang",
        "esri/request",

        // Layers
        "esri/layers/Layer",
        "esri/layers/FeatureLayer",
        "esri/layers/GeoJSONLayer",
        "esri/layers/GraphicsLayer",
        "esri/layers/MapImageLayer",

        // Tasks
        "esri/tasks/QueryTask",
        "esri/tasks/support/Query",

        // Renderes
        "esri/Color",
        "esri/renderers/smartMapping/creators/color",
        "esri/renderers/smartMapping/statistics/histogram",
        "esri/widgets/smartMapping/ClassedColorSlider",
        "esri/renderers/smartMapping/symbology/color",
        "esri/renderers/smartMapping/creators/type",

        "esri/smartMapping/renderers/color",
        "esri/smartMapping/symbology/color",

        // Popup
        "esri/PopupTemplate",
        "esri/geometry/support/webMercatorUtils",
        "esri/geometry/SpatialReference",
        "esri/geometry/Point",

        // Widgets
        "esri/widgets/Home",
        "esri/widgets/Zoom",
        "esri/widgets/Compass",
        "esri/widgets/Locate",
        "esri/widgets/Track",
        "esri/widgets/Search",
        "esri/widgets/Legend",
        "esri/widgets/BasemapGallery",
        "esri/widgets/BasemapGallery/support/LocalBasemapsSource",
        "esri/widgets/ScaleBar",
        "esri/widgets/Attribution",
        "esri/widgets/LayerList",
        "esri/tasks/Locator",
        "esri/widgets/Expand",
        "esri/widgets/Swipe",
        "esri/widgets/Slider",
        "esri/widgets/Print",

        "esri/widgets/Sketch",
        "esri/widgets/Sketch/SketchViewModel",
        "esri/widgets/DistanceMeasurement2D",
        "esri/widgets/AreaMeasurement2D",
        "esri/widgets/CoordinateConversion",
        "esri/widgets/CoordinateConversion/support/Format",
        "esri/widgets/CoordinateConversion/support/Conversion",

        "esri/tasks/PrintTask",
        "esri/tasks/support/PrintTemplate",
        "esri/tasks/support/PrintParameters",

        // Calcite Maps
        "calcite-maps/calcitemaps-v0.10",
        "calcite-maps/calcitemaps-arcgis-support-v0.10",

        // Boostrap
        "bootstrap/Collapse",
        "bootstrap/Dropdown",
        "bootstrap/Tab",
        // "bootstrap/Carousel",
        // "bootstrap/Tooltip",
        // "bootstrap/Modal",

        // Dojo
        "dojo/query",
        "dojo/aspect",
        "dojo/domReady!",
    ], function (
        __esriConfig,
        __Map,
        __Basemap,
        __MapView,
        __Graphic,
        __Collection,
        __watchUtils,
        __esriLang,
        __esriRequest,
        __Layer,
        __FeatureLayer,
        __GeoJSONLayer,
        __GraphicsLayer,
        __MapImageLayer,

        __QueryTask,
        __Query,

        __Color,
        __colorRendererCreator,
        __histogram,
        __ClassedColorSlider,
        __colorSchemes,
        __typeRendererCreator,

        __colorRendererCreator2,
        __colorSchemes2,

        __PopupTemplate,
        __webMercatorUtils,
        __SpatialReference,
        __Point,
        __Home,
        __Zoom,
        __Compass,
        __Locate,
        __Track,
        __Search,
        __Legend,
        __BasemapGallery,
        __LocalBasemapsSource,
        __ScaleBar,
        __Attribution,
        __LayerList,
        __Locator,
        __Expand,
        __Swipe,
        __Slider,
        __Print,
        __Sketch,
        __SketchViewModel,
        __DistanceMeasurement2D,
        __AreaMeasurement2D,
        __CoordinateConversion,
        __FormatCoordinate,
        __ConversionCoordinate,
        __PrintTask,
        __PrintTemplate,
        __PrintParameters,
        __CalciteMaps,
        __CalciteMapArcGISSupport,
        __Collapse,
        __Dropdown,
        __Tab,
        // __Carousel, __Tooltip, __Modal,
        __query,
        __aspect
    ) {
        try {
            _esriConfig = __esriConfig;
            _Map = __Map;
            _Basemap = __Basemap;
            _MapView = __MapView;
            _Graphic = __Graphic;

            _Collection = __Collection;
            _watchUtils = __watchUtils;
            _esriLang = __esriLang;
            _esriRequest = __esriRequest;

            _Layer = __Layer;
            _FeatureLayer = __FeatureLayer;
            _GeoJSONLayer = __GeoJSONLayer;
            _GraphicsLayer = __GraphicsLayer;
            _MapImageLayer = __MapImageLayer;

            _QueryTask = __QueryTask;
            _Query = __Query;

            _Color = __Color;
            _colorRendererCreator = __colorRendererCreator;
            _histogram = __histogram;
            _ClassedColorSlider = __ClassedColorSlider;
            _colorSchemes = __colorSchemes;
            _typeRendererCreator = __typeRendererCreator;

            _colorRendererCreator2 = __colorRendererCreator2;
            _colorSchemes2 = __colorSchemes2;

            _PopupTemplate = __PopupTemplate;
            _webMercatorUtils = __webMercatorUtils;
            _SpatialReference = __SpatialReference;
            _Point = __Point;

            _Home = __Home;
            _Zoom = __Zoom;
            _Compass = __Compass;
            _Locate = __Locate;
            _Track = __Track;
            _Search = __Search;
            _Legend = __Legend;
            _BasemapGallery = __BasemapGallery;
            _LocalBasemapsSource = __LocalBasemapsSource;
            _ScaleBar = __ScaleBar;
            _Attribution = __Attribution;
            _LayerList = __LayerList;
            _Locator = __Locator;
            _Expand = __Expand;
            _Swipe = __Swipe;
            _Slider = __Slider;
            _Print = __Print;

            _Sketch = __Sketch;
            _SketchViewModel = __SketchViewModel;
            _DistanceMeasurement2D = __DistanceMeasurement2D;
            _AreaMeasurement2D = __AreaMeasurement2D;
            _CoordinateConversion = __CoordinateConversion;
            _FormatCoordinate = __FormatCoordinate;
            _ConversionCoordinate = __ConversionCoordinate;

            _PrintTask = __PrintTask;
            _PrintTemplate = __PrintTemplate;
            _PrintParameters = __PrintParameters;

            _CalciteMaps = __CalciteMaps;
            _CalciteMapArcGISSupport = __CalciteMapArcGISSupport;

            _Collapse = __Collapse;
            _Dropdown = __Dropdown;
            _Tab = __Tab;
            // _Carousel = __Carousel;
            // _Tooltip = __Tooltip;
            // _Modal = __Modal;

            _query = __query;
            _aspect = __aspect;

            // Carga de servicios
            loadServicesUARIV();

            InitMap2();

        } catch (error) {
            console.log(error);
        }
    });
}

/* Creacion VGV */
function loadHechosVictimas(varAnio, offLoading) {
    let datosCompressAnio = vgv_compress_Hechos.filter(function (item) {
        return item.Anio == varAnio;
    });

    if (datosCompressAnio.length == 0) {
        $.ajax({
            url: URL_HechosBuscar_Services + varAnio + "C.json",
            success: function (data) {
                vgv_compress_Hechos.push({
                    Data: data,
                    Anio: varAnio,
                });

                proccessHechosVictimas(varAnio, data, offLoading);
                filtrarHechosVictimas(varAnio);
            },
            error: function (xhr, status, error) {
                alerta(
                    "No se pudieron cargar los datos desde la Base de Datos\n\nPor favor intente acceder al visor más tarde."
                );
                console.log(error);
            },
        });
    } else {
        proccessHechosVictimas(varAnio, datosCompressAnio[0].Data, offLoading);
        filtrarHechosVictimas(varAnio);
    }
}

function proccessHechosVictimas(varAnio, data, offLoading) {
    let resultadosHechosAnio = vgv_resultados_Hechos.filter(function (item) {
        return item.Anio == varAnio;
    });

    if (resultadosHechosAnio.length == 0) {
        let dataPakoJSON = splitDataUncompress(data);

        for (let idxData = 0; idxData < dataPakoJSON.length; idxData++) {
            dataPakoJSON[idxData].PER_OCU = parseInt(dataPakoJSON[idxData].PER_OCU);
            dataPakoJSON[idxData].PER_DECLA = parseInt(
                dataPakoJSON[idxData].PER_DECLA
            );
            dataPakoJSON[idxData].EVENTOS = parseInt(dataPakoJSON[idxData].EVENTOS);
            dataPakoJSON[idxData].DISCAPACIDAD = "NO";
        }

        vgv_resultados_Hechos.push({
            Data: dataPakoJSON,
            Anio: varAnio,
        });
    }

    if (offLoading) {
        if (loading.isOpen()) {
            loading.close();
        }
    }
}

function filtrarHechosVictimas(varAnio) {
    // recupera los datos para el año seleccionado
    let lstResultadosHechos = vgv_resultados_Hechos.filter(function (item) {
        return item.Anio == varAnio;
    })[0].Data;

    // Elimina los hechos agrupados para ese año
    vgv_group_Hechos = vgv_group_Hechos.filter(function (item) {
        return item.Anio != varAnio;
    });

    // Filtra y agrupa los hechos para el año y los parametros definidos
    let resultadosGroup = recoverHechosVictimas(lstResultadosHechos, varAnio);
    vgv_group_Hechos.push({
        Data: resultadosGroup.Data,
        Anio: varAnio,
        VarAgrupacion: resultadosGroup.Variable,
    });
}

function displayHechosVictimas() {
    // recupera los datos agrupados para el año seleccionado
    let varAnio = $("#selectFiltro_Anio").val();
    // AnioProcess == undefined ? $("#selectFiltro_Anio").val() : AnioProcess;
    let resultadosGroup = vgv_group_Hechos.filter(function (item) {
        return item.Anio == varAnio;
    })[0].Data;

    // Recupera el filtro espacial activo
    let filtroGeografico = $("#selectFiltro_Geografico").val();
    let parametros;

    if (filtroGeografico == "filtroDepartamento") {
        // parametros de visualización
        parametros = {
            tLayerBase: nameLayerDepartamentos,
            domFilter: "selectFiltro_Departamento",
            nivelGeografico: "Departamento",
            campoGeografico: "DPTO_NCDGO",
            nombreGeografico: "DPTO_CNMBR",
            adjNombreGeografico: null,
            Anio: varAnio,
        };

    } else if (filtroGeografico == "filtroMunicipal") {
        // parametros de visualización
        parametros = {
            tLayerBase: nameLayerMunicipios,
            domFilter: "selectFiltro_Municipios",
            nivelGeografico: "Municipio",
            campoGeografico: "MPIO_NCDGO",
            nombreGeografico: "MPIO_CNMBR",
            adjNombreGeografico: "DPTO_CNMBR",
            Anio: varAnio,
        };
    } else if (filtroGeografico == "filtroDT") {
        // parametros de visualización
        parametros = {
            tLayerBase: nameLayerDT,
            domFilter: "selectFiltro_DT",
            nivelGeografico: "Dirección Territorial",
            campoGeografico: "DT_NCDGO",
            nombreGeografico: "DT_CNMBR",
            adjNombreGeografico: null,
            Anio: varAnio,
        };
    } else if (filtroGeografico == "filtroPDET") {
        // parametros de visualización
        parametros = {
            tLayerBase: nameLayerPDET,
            domFilter: "selectFiltro_PDET",
            nivelGeografico: "PDET",
            campoGeografico: "PDET_NCDGO",
            nombreGeografico: "PDET_CNMBR",
            adjNombreGeografico: null,
            Anio: varAnio,
        };
    }

    // Obtención de los datos finales
    if (map.findLayerById(parametros.tLayerBase) == undefined) {
        loadBaseGeografica(parametros.tLayerBase);
        let tLayer = map.findLayerById(parametros.tLayerBase);
        tLayer.when(function () {
            asignarValorGeografico(resultadosGroup, parametros);
        });
    } else {
        asignarValorGeografico(resultadosGroup, parametros);
    }
}

function recoverHechosVictimas(lstResultados, AnioFilter) {
    let lstResultadosHechos = jsonCopy(lstResultados);
    let lstGroupHechos = [];

    let idLayer;
    let varVariable = $("#selectFiltro_Variable").val();
    let txtVariable = $("#selectFiltro_Variable").val();

    if (txtVariable == vgv_lstVariable[0]) {
        varVariable = "PER_OCU";
    } else if (txtVariable == vgv_lstVariable[1]) {
        varVariable = "PER_DECLA";
    } else if (txtVariable == vgv_lstVariable[2]) {
        varVariable = "EVENTOS";
    }

    // Filtra los datos por los parametros
    lstResultadosHechos = filtrarParametro(
        lstResultadosHechos,
        "selectFiltro_Hecho",
        "HECHO",
        "text"
    );
    lstResultadosHechos = filtrarParametro(
        lstResultadosHechos,
        "selectFiltro_Genero",
        "SEXO",
        "text"
    );
    lstResultadosHechos = filtrarParametro(
        lstResultadosHechos,
        "selectFiltro_Etnia",
        "ETNIA",
        "text"
    );
    lstResultadosHechos = filtrarParametro(
        lstResultadosHechos,
        "selectFiltro_Discapacidad",
        "DISCAPACIDAD",
        "text"
    );
    lstResultadosHechos = filtrarParametro(
        lstResultadosHechos,
        "selectFiltro_CicloVital",
        "CICLO_VITAL",
        "text"
    );

    // Recupera el filtro espacial activo
    let filtroGeografico = $("#selectFiltro_Geografico").val();

    if (filtroGeografico == "filtroDepartamento") {
        idLayer = nameLayerDepartamentos;
        lstResultadosHechos = filtrarParametro(
            lstResultadosHechos,
            "selectFiltro_Departamento",
            "COD_ESTADO_DEPTO",
            "value"
        );
        lstGroupHechos = {
            Data: agruparHechosVictimas(lstResultadosHechos, "COD_ESTADO_DEPTO"),
            Variable: "COD_ESTADO_DEPTO",
        };
    } else if (filtroGeografico == "filtroMunicipal") {
        lstResultadosHechos = filtrarParametro(
            lstResultadosHechos,
            "selectFiltro_Municipios",
            "COD_CIUDAD_MUNI",
            "value"
        );
        lstGroupHechos = {
            Data: agruparHechosVictimas(lstResultadosHechos, "COD_CIUDAD_MUNI"),
            Variable: "COD_CIUDAD_MUNI",
        };
    } else if (filtroGeografico == "filtroDT") {
        lstResultadosHechos = filtrarParametro(
            lstResultadosHechos,
            "selectFiltro_DT",
            "COD_TERRITORIAL",
            "value"
        );
        lstGroupHechos = {
            Data: agruparHechosVictimas(lstResultadosHechos, "COD_TERRITORIAL"),
            Variable: "COD_TERRITORIAL",
        };
    } else if (filtroGeografico == "filtroPDET") {
        lstResultadosHechos = filtrarParametro(
            lstResultadosHechos,
            "selectFiltro_PDET",
            "COD_PDET",
            "value"
        );
        lstGroupHechos = {
            Data: agruparHechosVictimas(lstResultadosHechos, "COD_PDET"),
            Variable: "COD_PDET",
        };
    }

    // Agrega los datos filtrados
    let titleFilter = "Results_" + idLayer + "_" + varVariable + "_" + AnioFilter;
    vgv_filter_Hechos = vgv_filter_Hechos.filter(function (item) {
        return item.Title != titleFilter;
    });
    vgv_filter_Hechos.push({
        DataFilter: lstResultadosHechos,
        Anio: AnioFilter,
        Title: titleFilter,
    });

    return lstGroupHechos;
}

function filtrarParametro(
    lstHechos,
    domFilter,
    campoParametro,
    campoSeleccionado
) {
    let parameterSelected = $("#" + domFilter + " option:selected");
    let parameterOptions = $("#" + domFilter + " option");

    if (
        parameterSelected.length > 0 &&
        parameterSelected.length < parameterOptions.length
    ) {
        let parametrosSeleccionados = parameterSelected.map(function (a, item) {
            return item[campoSeleccionado];
        });

        let lstResultadosHechosParametros = [];
        for (
            let indexParametros = 0; indexParametros < parametrosSeleccionados.length; indexParametros++
        ) {
            for (
                let indexResultado = 0; indexResultado < lstHechos.length; indexResultado++
            ) {
                if (
                    parametrosSeleccionados[indexParametros] ==
                    lstHechos[indexResultado][campoParametro]
                ) {
                    lstResultadosHechosParametros.push(lstHechos[indexResultado]);
                }
            }
        }
        lstHechos = jsonCopy(lstResultadosHechosParametros);
    }

    return lstHechos;
}

function agruparHechosVictimas(lstHechos, campoVariable) {
    let resultHechos = [];
    lstHechos.forEach(function (a) {
        if (!this[a[campoVariable]]) {
            this[a[campoVariable]] = {
                VAR_AGRUPACION: a[campoVariable],
                EVENTOS: 0,
                PER_OCU: 0,
                PER_DECLA: 0,
            };
            resultHechos.push(this[a[campoVariable]]);
        }
        this[a[campoVariable]].EVENTOS += a.EVENTOS;
        this[a[campoVariable]].PER_OCU += a.PER_OCU;
        this[a[campoVariable]].PER_DECLA += a.PER_DECLA;
    }, Object.create(null));

    resultHechos = resultHechos.filter(function (item) {
        return item.VAR_AGRUPACION != undefined;
    });

    return resultHechos;
}

function agruparHechosVictimasMulti(lstHechos, campoVariable1, campoVariable2) {
    var helper = {};
    var result = lstHechos.reduce(function (r, o) {
        var key = o[campoVariable1] + "-" + o[campoVariable2];

        if (!helper[key]) {
            helper[key] = Object.assign({}, o); // create a copy of o
            r.push(helper[key]);
        } else {
            helper[key].EVENTOS += o.EVENTOS;
            helper[key].PER_OCU += o.PER_OCU;
            helper[key].PER_DECLA += o.PER_DECLA;
        }

        return r;
    }, []);

    return result;
}

function asignarValorGeografico(lstResultadosGroup, lstParametros) {
    if (lstResultadosGroup.length > 0) {
        let varVariable = $("#selectFiltro_Variable").val();
        let txtVariable = $("#selectFiltro_Variable").val();

        if (txtVariable == vgv_lstVariable[0]) {
            varVariable = "PER_OCU";
        } else if (txtVariable == vgv_lstVariable[1]) {
            varVariable = "PER_DECLA";
        } else if (txtVariable == vgv_lstVariable[2]) {
            varVariable = "EVENTOS";
        }

        let varAnio = lstParametros.Anio;
        const tLayer = map.findLayerById(lstParametros.tLayerBase);

        let idLayerResults =
            "Results_" + tLayer.id + "_" + varVariable + "_" + varAnio;
        if (map.findLayerById(idLayerResults)) {
            map.remove(map.findLayerById(idLayerResults));
        }

        let query = tLayer.createQuery();
        query.where = "1=1";

        let selectFiltroSelected = $(
            "#" + lstParametros.domFilter + " option:selected"
        );
        let selectFiltroOption = $("#" + lstParametros.domFilter + " option");

        if (selectFiltroSelected.length == 1) {
            query.where =
                lstParametros.campoGeografico +
                " = " +
                parseInt(selectFiltroSelected.val());
        } else if (selectFiltroSelected.length < selectFiltroOption.length) {
            let areaGeograficaSeleccionada = selectFiltroSelected.map(function (
                a,
                item
            ) {
                return parseInt(item.value);
            });

            areaGeograficaSeleccionada = Object.values(areaGeograficaSeleccionada);
            areaGeograficaSeleccionada.pop();
            areaGeograficaSeleccionada.pop();
            areaGeograficaSeleccionada = areaGeograficaSeleccionada.join(",");
            query.where =
                lstParametros.campoGeografico +
                " IN (" +
                areaGeograficaSeleccionada +
                ")";
        }

        tLayer.queryFeatures(query).then(function (results) {
            for (let indexGeo = 0; indexGeo < results.features.length; indexGeo++) {
                results.features[indexGeo].attributes.OBJECTID = indexGeo;
                results.features[indexGeo].attributes.VGV_NVALOR = null;

                let groupHechoGeo = lstResultadosGroup.filter(function (item) {
                    return parseInt(item.VAR_AGRUPACION) == parseInt(results.features[indexGeo].attributes[lstParametros.campoGeografico])
                })[0];

                if (groupHechoGeo != undefined && parseInt(groupHechoGeo[varVariable]) > 0) {
                    results.features[indexGeo].attributes.VGV_NVALOR = parseInt(groupHechoGeo[varVariable]);
                }
            }

            let varContent = "";
            if (lstParametros.adjNombreGeografico != null) {
                varContent = `Durante el año <b>${varAnio}</b> se presentaron <b>{VGV_NVALOR} ${txtVariable}</b> en el ${lstParametros.nivelGeografico} de <b>{${lstParametros.nombreGeografico}} ({${lstParametros.adjNombreGeografico}})</b>.`;
            } else {
                varContent = `Durante el año <b>${varAnio}</b> se presentaron <b>{VGV_NVALOR} ${txtVariable}</b> en el ${lstParametros.nivelGeografico} de <b>{${lstParametros.nombreGeografico}}</b>.`;
            }

            consulta_layers.push(idLayerResults);

            const layerResults = new _FeatureLayer({
                source: results.features,
                fields: tLayer.fields,
                objectIdField: "OBJECTID",
                opacity: 0.8,
                title: txtVariable +
                    " por " +
                    lstParametros.nivelGeografico +
                    " para el año " +
                    varAnio,
                id: idLayerResults,
                popupTemplate: {
                    title: "<b>" + txtVariable + " por año</b>",
                    content: varContent,
                    fieldInfos: [{
                        fieldName: "VGV_NVALOR",
                        format: {
                            digitSeparator: true,
                            places: 0,
                        },
                    }, ],
                },
                copyright: "Unidad para las Víctimas",
                visible: true,
                legendEnabled: true,
                listMode: "show",
                layerOrigen: tLayer.id.split("_")[1],
                variableOrigen: txtVariable,
            });

            map.add(layerResults);
            generateSimbology(layerResults);

            layerResults.when(function () {
                current_reportes = arrayRemove(current_reportes, "consultaTematica");
                reporteUso("consultaTematica", layerResults.id, "load");

                let ext = layerResults.fullExtent;
                let cloneExt = ext.clone();
                view
                    .goTo({
                        target: layerResults.fullExtent,
                        extent: cloneExt.expand(1.25),
                    })
                    .then(function () {
                        if (!LegendExpand.expanded) {
                            LegendExpand.expand();
                        }
                    });
                addOptionSwipe(layerResults);
            });

            const tLayerLabels = map.findLayerById(tLayerBaseLabelsId);
            map.reorder(tLayerLabels, map.layers.items.length);
            tLayerLabels.visible = true;
        });
    } else {
        alerta("La consulta no arrojo resultados");
        current_reportes = arrayRemove(current_reportes, "consultaTematica");
        reporteUso("consultaTematica", "Sin resultados", "error");
    }
}

/* Simbologia */

function zSimbology() {
    $("#panelSymbologyP").css("z-index", current_Zindex);
    current_Zindex = current_Zindex + 1;
}

function closeSimbology() {
    sliderSimbology = null;
    $("#sliderSimbology").html("");

    $("#panelSymbologyP").hide();
    $("#panelSymbologyP").data("idLayer", null);
}

function gotoSimbology(tLayer) {
    zSimbology();

    $("#panelSymbologyP").data("idLayer", tLayer.id);
    $("#sliderSimbology").html("");
    $("#colorsContainer").html(generateColors());

    if (tLayer.id == "Time_" + sliderTimeRange.values[0]) {
        for (let idxAnios = 0; idxAnios < vgv_lstAnios.length; idxAnios++) {
            let timeLayer = map.findLayerById("Time_" + vgv_lstAnios[idxAnios]);
            generateSimbology(timeLayer);
        }
    } else {
        generateSimbology(tLayer);
    }

    current_reportes = arrayRemove(current_reportes, "Simbology");
    reporteUso("Simbology", tLayer.id, "load");

    $("#panelSymbologyP").show();
}

function changeParametersScheme() {
    let idlayer = $("#panelSymbologyP").data("idLayer");

    if (idlayer == "Time_" + sliderTimeRange.values[0]) {
        for (let idxAnios = 0; idxAnios < vgv_lstAnios.length; idxAnios++) {
            let timeLayer = map.findLayerById("Time_" + vgv_lstAnios[idxAnios]);
            generateSimbology(timeLayer);
        }
    } else {
        let tLayer = map.findLayerById(idlayer);
        generateSimbology(tLayer);
    }
}

function generateColors() {
    let strHTML = "";
    let geometry = "polygon";
    let themeList = ["high-to-low", "above-and-below"];

    for (let idxTheme = 0; idxTheme < themeList.length; idxTheme++) {
        let theme = themeList[idxTheme];
        let colorSchemeLayer = _colorSchemes.getSchemes({
            basemap: map.basemap,
            geometryType: geometry,
            theme: theme,
        });

        if (colorSchemeLayer.primaryScheme.colorsForClassBreaks.length >= 8) {
            strHTML += createContainerColor(theme, colorSchemeLayer.primaryScheme);
        }

        for (
            let idxScheme = 0; idxScheme < colorSchemeLayer.secondarySchemes.length; idxScheme++
        ) {
            if (
                colorSchemeLayer.secondarySchemes[idxScheme].colorsForClassBreaks
                .length >= 8
            ) {
                strHTML += createContainerColor(
                    theme,
                    colorSchemeLayer.secondarySchemes[idxScheme]
                );
            }
        }
    }

    $("#colorsContainer").html(strHTML);
}

function createContainerColor(theme, colorScheme) {
    let strHTML = "";

    let widthWindow = window.innerWidth;

    if (widthWindow <= 1024) {
        strHTML +=
            '<div data-tooltip="' +
            colorScheme.name +
            '" class="col-xs-4 col-md-2 border" onclick="changeScheme(\'' +
            theme +
            "', '" +
            colorScheme.name +
            "');\">";
    } else {
        strHTML +=
            '<div data-tooltip="' +
            colorScheme.name +
            '" class="col-xs-3 col-md-1 border" onclick="changeScheme(\'' +
            theme +
            "', '" +
            colorScheme.name +
            "');\">";
    }

    for (
        let idxColor = colorScheme.colors.length - 1; idxColor >= 0; idxColor--
    ) {
        let color = colorScheme.colors[idxColor];
        let rgbColor =
            color.r.toString() + "," + color.g.toString() + "," + color.b.toString();
        strHTML += '<div class="row">';
        strHTML +=
            '<div class="col-xs-8 col-xs-offset-2" style="background-color: rgb(' +
            rgbColor +
            '); border: #aaa solid 1px; height: 20px;"></div>';
        strHTML += "</div>";
    }

    strHTML += "</div>";

    return strHTML;
}

function changeScheme(theme, colorSchemeName) {
    let geometry = "polygon";
    let colorScheme = _colorSchemes.getSchemeByName({
        basemap: map.basemap,
        geometryType: geometry,
        theme: theme,
        name: colorSchemeName,
    });

    let idlayer = $("#panelSymbologyP").data("idLayer");

    if (idlayer == "Time_" + sliderTimeRange.values[0]) {
        for (let idxAnios = 0; idxAnios < vgv_lstAnios.length; idxAnios++) {
            let timeLayer = map.findLayerById("Time_" + vgv_lstAnios[idxAnios]);

            schemeLayer = schemeLayer.filter(function (item) {
                return item.idLayer != timeLayer.id;
            });

            schemeLayer.push({
                idLayer: timeLayer.id,
                colorScheme: colorScheme,
            });

            generateSimbology(timeLayer);
        }
    } else {
        let tLayer = map.findLayerById(idlayer);

        schemeLayer = schemeLayer.filter(function (item) {
            return item.idLayer != tLayer.id;
        });

        schemeLayer.push({
            idLayer: tLayer.id,
            colorScheme: colorScheme,
        });

        generateSimbology(tLayer);
    }
}

function generateSimbology(tLayer) {
    let classificationMethod = $("#class-select").val();
    let numClasses = parseInt($("#num-classes").val());

    classificationMethod =
        classificationMethod == undefined ||
        classificationMethod == null ||
        classificationMethod == "" ?
        "natural-breaks" :
        classificationMethod;

    const params = {
        layer: tLayer,
        field: "VGV_NVALOR",
        view: view,
        classificationMethod: classificationMethod,
        numClasses: numClasses,
        legendOptions: {
            title: tLayer.variableOrigen,
        },
    };

    current_reportes = arrayRemove(current_reportes, "Simbology");
    reporteUso("Simbology", tLayer.id, "update");

    let colorScheme = schemeLayer.filter(function (item) {
        return item.idLayer == tLayer.id;
    });

    if (colorScheme.length == 1 && colorScheme[0].colorScheme != null) {
        params.colorScheme = colorScheme[0].colorScheme;
    }

    _colorRendererCreator
        .createClassBreaksRenderer(params)
        .then(function (rendererResponse) {
            let colorScheme = schemeLayer.filter(function (item) {
                return item.idLayer == tLayer.id;
            });

            if (colorScheme.length == 0) {
                schemeLayer.push({
                    idLayer: tLayer.id,
                    colorScheme: rendererResponse.colorScheme,
                });
            }

            rendererResponse.renderer.defaultLabel = "Sin Datos";
            rendererResponse.renderer.defaultSymbol.color.a = 0.7;

            tLayer.renderer = rendererResponse.renderer;
            updateColorSlider(tLayer, rendererResponse);

            if (loading.isOpen()) {
                loading.close();
            }
        });
}

function updateColorSlider(tLayer, rendererResult) {
    _histogram({
        layer: tLayer,
        field: "VGV_NVALOR",
        view: view,
        numBins: 100,
    }).then(function (histogramResult) {
        $("#sliderSimbology").html("");

        sliderSimbology = _ClassedColorSlider.fromRendererResult(
            rendererResult,
            histogramResult
        );

        sliderSimbology.container = "sliderSimbology";
        sliderSimbology.viewModel.precision = 1;

        function changeEventHandler() {
            const renderer = tLayer.renderer.clone();
            renderer.classBreakInfos = sliderSimbology.updateClassBreakInfos(
                renderer.classBreakInfos
            );
            tLayer.renderer = renderer;
        }

        sliderSimbology.on(
            ["thumb-change", "thumb-drag", "min-change", "max-change"],
            changeEventHandler
        );
    });
}

function uniqueRendererLayer(tLayer) {
    let typeParams = {
        layer: tLayer,
        view: view,
        field: "VGV_NVALOR",
        legendOptions: {
            title: tLayer.variableOrigen,
        },
    };

    _typeRendererCreator
        .createRenderer(typeParams)
        .then(function (response) {
            tLayer.renderer = response.renderer;
        })
        .catch(function (error) {
            console.error("there was an error: ", error);
        });
}

/* Time */

function timeHechosVictimas() {
    // Recupera el filtro espacial activo
    let filtroGeografico = $("#selectFiltro_Geografico").val();
    let parametros;

    if (filtroGeografico == "filtroDepartamento") {
        parametros = {
            tLayerBase: nameLayerDepartamentos,
            domFilter: "selectFiltro_Departamento",
            nivelGeografico: "Departamento",
            campoGeografico: "DPTO_NCDGO",
            nombreGeografico: "DPTO_CNMBR",
            adjNombreGeografico: null,
        };
    } else if (filtroGeografico == "filtroMunicipal") {
        parametros = {
            tLayerBase: nameLayerMunicipios,
            domFilter: "selectFiltro_Municipios",
            nivelGeografico: "Municipio",
            campoGeografico: "MPIO_NCDGO",
            nombreGeografico: "MPIO_CNMBR",
            adjNombreGeografico: "DPTO_CNMBR",
        };
    } else if (filtroGeografico == "filtroDT") {
        parametros = {
            tLayerBase: nameLayerDT,
            domFilter: "selectFiltro_DT",
            nivelGeografico: "Dirección Territorial",
            campoGeografico: "DT_NCDGO",
            nombreGeografico: "DT_CNMBR",
        };
    } else if (filtroGeografico == "filtroPDET") {
        parametros = {
            tLayerBase: nameLayerPDET,
            domFilter: "selectFiltro_PDET",
            nivelGeografico: "PDET",
            campoGeografico: "PDET_NCDGO",
            nombreGeografico: "PDET_CNMBR",
            adjNombreGeografico: null,
        };
    }

    // Obtención de los datos finales
    if (map.findLayerById(parametros.tLayerBase) == undefined) {
        loadBaseGeografica(parametros.tLayerBase);
        let tLayer = map.findLayerById(parametros.tLayerBase);
        tLayer.when(function () {
            timeFeaturesVGV(parametros);
        });
    } else {
        timeFeaturesVGV(parametros);
    }
}

function timeFeaturesVGV(lstParametros) {
    const tLayer = map.findLayerById(lstParametros.tLayerBase);

    let query = tLayer.createQuery();
    query.where = "1=1";

    let selectFiltroSelected = $(
        "#" + lstParametros.domFilter + " option:selected"
    );
    let selectFiltroOption = $("#" + lstParametros.domFilter + " option");

    if (selectFiltroSelected.length == 1) {
        query.where =
            lstParametros.campoGeografico +
            " = " +
            parseInt(selectFiltroSelected.val());
    } else if (selectFiltroSelected.length < selectFiltroOption.length) {
        let areaGeograficaSeleccionada = selectFiltroSelected.map(function (
            a,
            item
        ) {
            return parseInt(item.value);
        });

        areaGeograficaSeleccionada = Object.values(areaGeograficaSeleccionada);
        areaGeograficaSeleccionada.pop();
        areaGeograficaSeleccionada.pop();
        areaGeograficaSeleccionada = areaGeograficaSeleccionada.join(",");
        query.where =
            lstParametros.campoGeografico +
            " IN (" +
            areaGeograficaSeleccionada +
            ")";
    }

    tLayer.queryFeatures(query).then(function (results) {
        let ext = tLayer.fullExtent;
        let cloneExt = ext.clone();
        view.goTo({
            target: tLayer.fullExtent,
            extent: cloneExt.expand(1.25),
        });

        let varVariable = $("#selectFiltro_Variable").val();
        let txtVariable = $("#selectFiltro_Variable").val();

        if (txtVariable == vgv_lstVariable[0]) {
            varVariable = "PER_OCU";
        } else if (txtVariable == vgv_lstVariable[1]) {
            varVariable = "PER_DECLA";
        } else if (txtVariable == vgv_lstVariable[2]) {
            varVariable = "EVENTOS";
        }

        for (let idxAnio = 0; idxAnio < vgv_lstAnios.length; idxAnio++) {
            if (
                vgv_lstAnios[idxAnio] >= sliderTimeRange.values[0] &&
                vgv_lstAnios[idxAnio] <= sliderTimeRange.values[1]
            ) {
                let groupHechosAnio = vgv_group_Hechos.filter(function (item) {
                    return item.Anio == vgv_lstAnios[idxAnio];
                })[0].Data;

                let featuresTemp = [];
                for (let indexGeo = 0; indexGeo < results.features.length; indexGeo++) {
                    results.features[indexGeo].attributes.OBJECTID = indexGeo;
                    results.features[indexGeo].attributes.VGV_NVALOR = null;

                    let groupHechoAnioGeo = groupHechosAnio.filter(function (item) {
                        return parseInt(item.VAR_AGRUPACION) == parseInt(results.features[indexGeo].attributes[lstParametros.campoGeografico])
                    })[0];

                    if (groupHechoAnioGeo != undefined && parseInt(groupHechoAnioGeo[varVariable]) > 0) {
                        results.features[indexGeo].attributes.VGV_NVALOR = parseInt(groupHechoAnioGeo[varVariable]);
                    }

                    featuresTemp.push($.extend(true, {}, results.features[indexGeo]));
                }

                let AnioActual = vgv_lstAnios[idxAnio];
                let varContent = "";
                if (lstParametros.adjNombreGeografico != null) {
                    varContent = `Durante el año <b>${AnioActual}</b> se presentaron <b>{VGV_NVALOR} ${txtVariable}</b> en el ${lstParametros.nivelGeografico} de <b>{${lstParametros.nombreGeografico}} ({${lstParametros.adjNombreGeografico}})</b>.`;
                } else {
                    varContent = `Durante el año <b>${AnioActual}</b> se presentaron <b>{VGV_NVALOR} ${txtVariable}</b> en el ${lstParametros.nivelGeografico} de <b>{${lstParametros.nombreGeografico}}</b>.`;
                }

                const layerTime = new _FeatureLayer({
                    source: featuresTemp,
                    fields: tLayer.fields,
                    objectIdField: "OBJECTID",
                    opacity: 0.8,
                    title: txtVariable +
                        " por " +
                        lstParametros.nivelGeografico +
                        " para el año " +
                        vgv_lstAnios[idxAnio],
                    id: "Time_" + vgv_lstAnios[idxAnio],
                    popupTemplate: {
                        title: "<b>" + txtVariable + "</b>",
                        content: varContent,
                        fieldInfos: [{
                            fieldName: "VGV_NVALOR",
                            format: {
                                digitSeparator: true,
                                places: 0,
                            },
                        }, ],
                    },
                    copyright: "Unidad para las Víctimas",
                    visible: false,
                    legendEnabled: true,
                    listMode: "hide",
                    layerOrigen: tLayer.id.split("_")[1],
                    variableOrigen: txtVariable,
                });

                current_reportes = arrayRemove(current_reportes, "TimeSlider");
                reporteUso(
                    "TimeSlider",
                    layerTime.layerOrigen + " - " + layerTime.variableOrigen,
                    "load"
                );

                map.add(layerTime);
                generateSimbology(layerTime);
            }
        }

        const tLayerLabels = map.findLayerById(tLayerBaseLabelsId);
        map.reorder(tLayerLabels, map.layers.items.length);
        tLayerLabels.visible = true;

        displayTimeVGV();
    });
}

function simbologyTimeVGV() {
    closeSimbology();

    if (map.findLayerById("Time_" + sliderTimeRange.values[0])) {
        gotoSimbology(map.findLayerById("Time_" + sliderTimeRange.values[0]));
    }

    stopAnimation();
    $("#speed-time").val(1);
    $("#speed-time").trigger("change");
    $("#settingsTimeVGV").removeClass("in");
    setTimeYear(sliderTimeRange.values[0]);
}





function displayTimeVGV() {
    sliderTime.on("thumb-drag", inputTimeHandler);

    setTimeYear(sliderTimeRange.values[0]);
    let layerTime = map.findLayerById(idLayerTime);
    layerTime.when(function () {
        $("#sliderContainerTime").show();
        $("#legendTimeVGV").show();
        $("#deleteTimeVGV").show();
        $("#settingsTime").show();
        $("#helpTimeVGV").removeClass("in");

        const subLayerTime = layerTime.sublayers.find(function (sublayer) {
            return sublayer.id === sliderTime.min;
        });
        subLayerTime.visible = true;

        if (loading.isOpen()) {
            loading.close();
        }
    });
}

function deleteTimeVGV() {
    vgv_group_Hechos = [];

    current_reportes = arrayRemove(current_reportes, "TimeSlider");
    reporteUso(
        "TimeSlider",
        sliderTimeRange.values[0] + " - " + sliderTimeRange.values[1],
        "delete"
    );

    for (let idxAnio = 0; idxAnio < vgv_lstAnios.length; idxAnio++) {
        if (map.findLayerById("Time_" + vgv_lstAnios[idxAnio])) {
            map.remove(map.findLayerById("Time_" + vgv_lstAnios[idxAnio]));
        }
    }

    sliderTimeRange.values[0] = vgv_lstAnios[0];
    sliderTimeRange.values[1] = vgv_lstAnios[vgv_lstAnios.length - 1];

    sliderTime.min = sliderTimeRange.values[0];
    sliderTime.max = sliderTimeRange.values[1];

    stopAnimation();

    $("#textSliderTimeRange").text(
        "Rango de años a calcular (" +
        vgv_lstAnios[0].toString() +
        " - " +
        vgv_lstAnios[vgv_lstAnios.length - 1].toString() +
        ")"
    );
    $("#legendTimeVGV").hide();
    $("#sliderContainerTime").hide();
    $("#deleteTimeVGV").hide();
    $("#settingsTime").hide();
    $("#helpTimeVGV").addClass("in");
    $("#createTimeVGV").show();
}

function setTimeYear(value) {
    var sliderValue = document.getElementById("sliderValue");
    sliderValue.innerHTML = Math.floor(value);
    sliderTime.viewModel.setValue(0, value);

    offLayersTime();
    let layerTime = map.findLayerById(idLayerTime);
    const subLayerTime = layerTime.sublayers.find(function (sublayer) {
        return sublayer.id === Math.floor(value);
    });
    subLayerTime.visible = true;

}

function startAnimation() {
    stopAnimation();
    animation = animate(sliderTimeRange.values[0]);
    playButton.classList.add("toggled");
}

function stopAnimation() {
    if (!animation) {
        return;
    }

    animation.remove();
    animation = null;
    playButton.classList.remove("toggled");
}

function animate(startValue) {
    var animating = true;
    var value = startValue;

    var frame = function (timestamp) {
        if (!animating) {
            return;
        }

        value += 0.5;
        if (value > sliderTimeRange.values[1]) {
            value = sliderTimeRange.values[0];
        }

        setTimeYear(value);

        setTimeout(function () {
            requestAnimationFrame(frame);
        }, 1000 / velocidadTime);
    };

    frame();

    return {
        remove: function () {
            animating = false;
        },
    };
}

function inputTimeHandler(event) {
    stopAnimation();
    setTimeYear(event.value);
}

function offLayersTime() {
    let layerTime = map.findLayerById(idLayerTime);
    for (let idxAnio = sliderTime.min; idxAnio <= sliderTime.max; idxAnio++) {

        const subLayerTime = layerTime.sublayers.find(function (sublayer) {
            return sublayer.id === idxAnio;
        });
        subLayerTime.visible = false;

    }
}



for (let idxAnio = 0; idxAnio < vgv_lstAnios.length; idxAnio++) {
    if (
      vgv_lstAnios[idxAnio] >= sliderTimeRange.values[0] &&
      vgv_lstAnios[idxAnio] <= sliderTimeRange.values[1]
    ) {
      let AnioTime = vgv_lstAnios[idxAnio];

      setTimeout(() => {
        offLayersTime();
        onLayerTime(AnioTime);
        var sliderValue = document.getElementById("sliderValue");
        sliderValue.innerHTML = AnioTime;
        // sliderTime.viewModel.setValue(0, AnioTime);
      }, 2000 * (AnioTime - sliderTime.min));
    }
  }