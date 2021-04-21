"use strict";

$(document).ready(function () {
  for (let numAnio = vgv_inicioAnio; numAnio <= vgv_finAnio; numAnio++) {
    vgv_lstAnios.push(numAnio);
  }
  $("#textSliderTimeRange").text(
    "Rango de años a calcular (" +
      vgv_lstAnios[0].toString() +
      " - " +
      vgv_lstAnios[vgv_lstAnios.length - 1].toString() +
      ")"
  );

  init();

  document
    .getElementById("settingsFileCSV")
    .addEventListener("change", uploadCSV, false);

  playButton = document.getElementById("playButton");
  playButton.addEventListener("click", function () {
    if (playButton.classList.contains("toggled")) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  $("#downloadTableExcel").click(function () {
    let nombreArchivo = $("#panelTableP").data("nombreArchivo");
    let nombreTabla = $("#panelTableP").data("nombreTabla");
    tableFilterData.download("xlsx", nombreArchivo + ".xlsx", {
      sheetName: nombreTabla,
    });
  });

  $("#downloadTableCSV").click(function () {
    let nombreArchivo = $("#panelTableP").data("nombreArchivo");
    tableFilterData.download("csv", nombreArchivo + ".csv");
  });

  $("#downloadTableJSON").click(function () {
    let nombreArchivo = $("#panelTableP").data("nombreArchivo");
    tableFilterData.download("json", nombreArchivo + ".json");
  });

  $("#downloadTablePdf").click(function () {
    let nombreArchivo = $("#panelTableP").data("nombreArchivo");
    let nombreTabla = $("#panelTableP").data("nombreTabla");
    tableFilterData.download("pdf", nombreArchivo + ".pdf", {
      orientation: "landscape",
      title: nombreTabla,
    });
  });

  $("#num-classes-VGV").on("change", function () {
    $("#label-num-classes-VGV").text(
      "Clases (" + $("#num-classes-VGV").val() + ")"
    );
  });

  $("#num-classes-CSV").on("change", function () {
    $("#label-num-classes-CSV").text(
      "Clases (" + $("#num-classes-CSV").val() + ")"
    );
  });

  $("#speed-time").on("change", function () {
    $("#label-speed-time").text(
      "Velocidad de reproducción (" + $("#speed-time").val() + ")"
    );
    velocidadTime = $("#speed-time").val();
  });

  // Graficas
  $("#settingsVariableChart").on("change", function () {
    generateVisualChart();
  });
  $("#settingsParametro1Chart").on("change", function () {
    generateVisualChart();
  });
  $("#settingsParametro2Chart").on("change", function () {
    generateVisualChart();
  });
  $("#settingsTipoChart").on("change", function () {
    $("#labelParametro2Chart").hide();
    $("#settingsParametro2Chart").hide();
    generateVisualChart();
  });

  // Cambios de Simbologia
  ajustarRampVGV();

  $("#styleColorRamp-VGV").click(function (e) {
    if (e.offsetX <= 100) {
      $("#styleRampColor1-VGV")[0].click();
    } else if (e.offsetX > 100 && e.offsetX <= 200) {
      $("#styleRampColor2-VGV")[0].click();
    } else if (e.offsetX > 200) {
      $("#styleRampColor3-VGV")[0].click();
    }
  });
  $("#styleRampColor1-VGV").on("change", function () {
    ajustarRampVGV();
  });
  $("#styleRampColor2-VGV").on("change", function () {
    ajustarRampVGV();
  });
  $("#styleRampColor3-VGV").on("change", function () {
    ajustarRampVGV();
  });

  ajustarRampCSV();
  $("#styleColorRamp-CSV").click(function (e) {
    if (e.offsetX <= 100) {
      $("#styleRampColor1-CSV")[0].click();
    } else if (e.offsetX > 100 && e.offsetX <= 200) {
      $("#styleRampColor2-CSV")[0].click();
    } else if (e.offsetX > 200) {
      $("#styleRampColor3-CSV")[0].click();
    }
  });
  $("#styleRampColor1-CSV").on("change", function () {
    ajustarRampCSV();
  });
  $("#styleRampColor2-CSV").on("change", function () {
    ajustarRampCSV();
  });
  $("#styleRampColor3-CSV").on("change", function () {
    ajustarRampCSV();
  });
});

/* Inicializar la carga de interfaz */

function init() {
  interact(".panel-heading")
    .draggable({
      restrict: {
        restriction: ".calcite",
        endOnly: true,
        elementRect: {
          top: 0,
          left: 0,
          bottom: 1,
          right: 1,
        },
      },
    })
    .on("dragmove", function (event) {
      let target = event.target.parentElement.parentElement,
        x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
        y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

      target.style.webkitTransform = target.style.transform =
        "translate(" + x + "px, " + y + "px)";

      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    });
  $(window).on("resize", function () {
    updateSize();
  });
  $(window).on("click", function (event) {
    if (!event.target.matches(".moreOptionsDots")) {
      let dropdowns = document.getElementsByClassName("moreOptions-content");
      for (let openDropdown of dropdowns) {
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  });
  updateSize();

  // Inicializar mapa
  initMap();
}

function updateSize() {
  if ($(window).width() > 500) {
    interact(".panel-heading").draggable({
      enabled: true,
    });
  } else {
    interact(".panel-heading").draggable({
      enabled: false,
    });
  }
}

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

    // Layers
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/MapImageLayer",

    // Tasks
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",

    // Renderes
    "esri/Color",
    "esri/smartMapping/renderers/color",

    // Popup
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
    "esri/widgets/Expand",
    "esri/widgets/Swipe",
    "esri/widgets/Slider",

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

    // Dojo
    "dojo/domReady!",
  ], function (
    __esriConfig,
    __Map,
    __Basemap,
    __MapView,
    __Graphic,

    __Collection,
    __watchUtils,

    __FeatureLayer,
    __GeoJSONLayer,
    __GraphicsLayer,
    __MapImageLayer,

    __QueryTask,
    __Query,

    __Color,
    __colorRendererCreator,

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
    __Expand,
    __Swipe,
    __Slider,

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
    __Tab
  ) {
    try {
      _esriConfig = __esriConfig;
      _Map = __Map;
      _Basemap = __Basemap;
      _MapView = __MapView;
      _Graphic = __Graphic;

      _Collection = __Collection;
      _watchUtils = __watchUtils;

      _FeatureLayer = __FeatureLayer;
      _GeoJSONLayer = __GeoJSONLayer;
      _GraphicsLayer = __GraphicsLayer;
      _MapImageLayer = __MapImageLayer;

      _QueryTask = __QueryTask;
      _Query = __Query;

      _Color = __Color;
      _colorRendererCreator = __colorRendererCreator;

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
      _Expand = __Expand;
      _Swipe = __Swipe;
      _Slider = __Slider;

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

      // Carga de servicios
      loadServicesUARIV();

      InitMap2();
    } catch (error) {
      console.log(error);
    }
  });
}

function InitMap2() {
  // Config
  _esriConfig.apiKey =
    "AAPK16dc245e51af4cd58792f446f40c58edICSmkURdJi5igB7OXHABEip3-nJYIwlv1PBR87gdjey1CAdMES1tgYBrPqjDZhFo";
  _esriConfig.request.proxyUrl = URL_PROXY;
  _esriConfig.timeout = 600000;
  _esriConfig.request.interceptors.push({
    // Captura las peticiones a la URL de impresión
    urls: URL_Print_Services,

    before: function (params) {
      // Quita los labels en la leyenda
      let webMapJson = JSON.parse(params.requestOptions.query.Web_Map_as_JSON);

      if (webMapJson.layoutOptions.legendOptions.operationalLayers.length > 0) {
        for (
          let idxOperationalLayer = 0;
          idxOperationalLayer <
          webMapJson.layoutOptions.legendOptions.operationalLayers.length;
          idxOperationalLayer++
        ) {
          if (
            webMapJson.layoutOptions.legendOptions.operationalLayers[
              idxOperationalLayer
            ].id == tLayerBaseLabelsId
          ) {
            webMapJson.layoutOptions.legendOptions.operationalLayers.splice(
              idxOperationalLayer,
              1
            );
            break;
          }
        }
        params.requestOptions.query.Web_Map_as_JSON = JSON.stringify(
          webMapJson
        );
      }
    },
    after: function (response) {
      // pass
    },
  });

  // map
  map = new _Map();

  // View
  view = new _MapView({
    container: "mapViewDiv",
    map: map,
    extent: initialExtent,
    padding: {
      top: 50,
      bottom: 0,
    },
    ui: {
      components: [],
    },
  });

  view.constraints.geometry = initialExtent;
  view.constraints.snapToZoom = false;

  // Dibujar
  layerGraphicsTemp = new _GraphicsLayer({
    id: "layerGraphicsTemp",
    visible: true,
    listMode: "hide",
  });
  map.add(layerGraphicsTemp);

  // Medir
  $("#distanceButton").on("click", function () {
    $("#measurementAreaDiv").hide();
    $("#measurementPointDiv").hide();
    $("#measurementDistanceDiv").show();

    measureArea.viewModel.clearMeasurement();
    measureDistance.viewModel.clearMeasurement();
    measureDistance.viewModel.newMeasurement();
  });

  $("#areaButton").on("click", function () {
    $("#measurementDistanceDiv").hide();
    $("#measurementPointDiv").hide();
    $("#measurementAreaDiv").show();

    measureArea.viewModel.clearMeasurement();
    measureDistance.viewModel.clearMeasurement();
    measureArea.viewModel.newMeasurement();
  });

  $("#pointButton").on("click", function () {
    $("#measurementDistanceDiv").hide();
    $("#measurementAreaDiv").hide();
    $("#measurementPointDiv").show();

    measureArea.viewModel.clearMeasurement();
    measureDistance.viewModel.clearMeasurement();
  });

  addWidgets();
  view.when(function () {
    _CalciteMapArcGISSupport.setPopupPanelSync(view);

    // Carga selects
    loadDomainsVGV();

    // Oculta loading
    $("#initVGV").hide();

    // Carga la capa de labels
    loadLabelsGeo();

    $("#escalaImpresion").val(formatNumber(parseInt(view.scale)));

    // Procesa la lista de parametros
    processParametersVGV();

    map.layers.on("after-remove", function (event) {
      if (
        event.item.id != tLayerBaseLabelsId &&
        layerListWigdet.operationalItems.items.length == 1
      ) {
        const tLayerLabels = map.findLayerById(tLayerBaseLabelsId);
        tLayerLabels.visible = false;
      }
    });

    view.watch("scale", function (newScale) {
      $("#escalaImpresion").val(formatNumber(parseInt(newScale)));
    });
  });

  _watchUtils.when(legendWidget, "activeLayerInfos.length", function (evt) {
    setTimeout(function () {
      activeFirstLegend();
    }, 500);
  });
}

function processParametersVGV() {
  let yearParameter = getParameterByName("year");
  let variableParameter = getParameterByName("variable");
  let filtroParameter = getParameterByName("filtro");

  if (yearParameter != null) {
    $("#selectFiltro_Anio").val(yearParameter);
  }
  if (variableParameter != null) {
    if (filtroParameter == "Eventos") {
      $("#selectFiltro_Variable").val("Eventos");
    } else if (filtroParameter == "Declaracion") {
      $("#selectFiltro_Variable").val("Víctimas Declaración");
    } else if (filtroParameter == "Ocurrencia") {
      $("#selectFiltro_Variable").val("Víctimas Ocurrencia");
    }
  }
  if (filtroParameter != null) {
    if (filtroParameter == "Dpto") {
      $("#selectFiltro_Geografico").val("filtroDepartamento");
    } else if (filtroParameter == "Mpio") {
      $("#selectFiltro_Geografico").val("filtroMunicipal");
    } else if (filtroParameter == "DT") {
      $("#selectFiltro_Geografico").val("filtroDT");
    } else if (filtroParameter == "PDET") {
      $("#selectFiltro_Geografico").val("filtroPDET");
    }
  }

  if (
    yearParameter != null ||
    variableParameter != null ||
    filtroParameter != null
  ) {
    aplicarParametrosVGV();
  }
}

function addWidgets() {
  // Map widgets
  home = new _Home({
    view: view,
  });
  const zoom = new _Zoom({
    view: view,
  });
  const track = new _Track({
    view: view,
    graphic: new _Graphic({
      symbol: {
        type: "simple-marker",
        size: "12px",
        color: "green",
        outline: {
          color: "#efefef",
          width: "1.5px",
        },
      },
    }),
    useHeadingEnabled: true,
  });
  const compass = new _Compass({
    view: view,
  });
  const scaleBar = new _ScaleBar({
    view: view,
    unit: "metric",
    style: "ruler",
  });
  const attribution = new _Attribution({
    view: view,
  });

  // legend
  legendTime = new _Legend({
    container: "legendTimeVGV",
    view: view,
    style: "card",
    iconClass: "esri-icon-maps",
    id: "legendTime",
  });
  legendWidget = new _Legend({
    container: document.createElement("div"),
    view: view,
    style: "card",
    iconClass: "esri-icon-maps",
    id: "legendMain",
  });
  LegendExpand = new _Expand({
    content: legendWidget,
    view: view,
    expanded: false,
    autoCollapse: true,
    expandTooltip: "Leyenda",
  });

  // LayerList
  layerListWigdet = new _LayerList({
    container: document.createElement("div"),
    view: view,
    id: "layerListWigdet",
    listItemCreatedFunction: defineActions,
    selectionEnabled: true,
  });

  // MapasBase
  const localBaseMapSource = new _LocalBasemapsSource({
    basemaps: [
      _Basemap.fromId("streets-navigation-vector"),
      _Basemap.fromId("streets-vector"),
      _Basemap.fromId("oceans"),
      _Basemap.fromId("osm"),
      _Basemap.fromId("hybrid"),
      _Basemap.fromId("topo-vector"),
      _Basemap.fromId("gray-vector"),
      _Basemap.fromId("dark-gray-vector"),
      _Basemap.fromId("streets-night-vector"),
      //Nuevos
      _Basemap.fromId("arcgis-navigation"),
      _Basemap.fromId("arcgis-streets"),
      _Basemap.fromId("arcgis-oceans"),
      _Basemap.fromId("arcgis-light-gray"),
      _Basemap.fromId("arcgis-topographic"),
      _Basemap.fromId("arcgis-imagery"),
      _Basemap.fromId("arcgis-dark-gray"),
      _Basemap.fromId("arcgis-streets-night"),
    ],
  });

  const basemapDefault = _Basemap.fromId("streets-navigation-vector");
  const basemapGallery = new _BasemapGallery({
    container: document.createElement("div"),
    view: view,
    source: localBaseMapSource,
    activeBasemap: basemapDefault,
  });

  const baseMapExpand = new _Expand({
    content: basemapGallery,
    view: view,
    expanded: false,
    autoCollapse: true,
    expandTooltip: "Cambiar Mapa Base",
  });

  basemapGallery.watch("activeBasemap", function (basemap) {
    current_reportes = arrayRemove(current_reportes, "mapa base");
    reporteUso("mapa base", basemap.title, "load");
  });

  // Dibujar
  let pointSymbolSketch = {
    type: "simple-marker",
    style: "circle",
    color: "#8A2BE2",
    size: "16px",
    outline: {
      color: [255, 255, 255],
      width: 3,
    },
  };

  let polylineSymbolSketch = {
    type: "simple-line",
    color: "#8A2BE2",
    width: "3",
    style: "dash",
  };

  let polygonSymbolSketch = {
    type: "simple-fill",
    color: "rgba(138,43,226, 0.5)",
    style: "solid",
    outline: {
      color: "white",
      width: 1,
    },
  };

  const sketchViewModel = new _SketchViewModel({
    view: view,
    layer: layerGraphicsTemp,
    pointSymbol: pointSymbolSketch,
    polylineSymbol: polylineSymbolSketch,
    polygonSymbol: polygonSymbolSketch,
  });

  const sketch = new _Sketch({
    layer: layerGraphicsTemp,
    view: view,
    creationMode: "single",
    viewModel: sketchViewModel,
  });

  const sketchExpand = new _Expand({
    content: sketch,
    view: view,
    expanded: false,
    autoCollapse: true,
    expandTooltip: "Dibujar",
  });

  // Medir
  measureArea = new _AreaMeasurement2D({
    container: "measurementAreaDiv",
    view: view,
    unit: "square-kilometers",
    unitOptions: [
      "acres",
      "hectares",
      "square-feet",
      "square-us-feet",
      "square-yards",
      "square-miles",
      "square-meters",
      "square-kilometers",
    ],
  });

  measureDistance = new _DistanceMeasurement2D({
    container: "measurementDistanceDiv",
    view: view,
    unit: "kilometers",
    unitOptions: [
      "feet",
      "us-feet",
      "yards",
      "miles",
      "nautical-miles",
      "meters",
      "kilometers",
    ],
  });

  measurePoint = new _CoordinateConversion({
    container: "measurementPointDiv",
    view: view,
  });

  // Formatos de conversiones
  let magnaColombiaGeoFormat = new _FormatCoordinate({
    name: "Magna Sirgas Geográficas (EPSG:4686)",
    conversionInfo: {
      spatialReference: new _SpatialReference({
        wkid: 4686,
      }),
      reverseConvert: function (string, format) {
        var parts = string.split(",");
        return new _Point({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          spatialReference: {
            wkid: 4686,
          },
        });
      },
    },
    coordinateSegments: [
      {
        alias: "Longitude",
        description: "Longitud",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "Latitude",
        description: "Latitud",
        searchPattern: numberSearchPattern,
      },
    ],
    defaultPattern: "Latitud: Latitude, Longitud: Longitude",
  });

  let WGS84Format = new _FormatCoordinate({
    name: "WGS84 (EPSG:4326)",
    conversionInfo: {
      spatialReference: new _SpatialReference({
        wkid: 4326,
      }),
      reverseConvert: function (string, format) {
        var parts = string.split(",");
        return new _Point({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          spatialReference: {
            wkid: 4326,
          },
        });
      },
    },
    coordinateSegments: [
      {
        alias: "Longitude",
        description: "Longitud",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "Latitude",
        description: "Latitud",
        searchPattern: numberSearchPattern,
      },
    ],
    defaultPattern: "Latitud: Latitude, Longitud: Longitude",
  });

  let webMercatorFormat = new _FormatCoordinate({
    name: "Web Mercator (EPSG:3857)",
    conversionInfo: {
      spatialReference: new _SpatialReference({
        wkid: 3857,
      }),
      reverseConvert: function (string, format) {
        var parts = string.split(",");
        return new _Point({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          spatialReference: {
            wkid: 3857,
          },
        });
      },
    },
    coordinateSegments: [
      {
        alias: "East",
        description: "East",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "North",
        description: "North",
        searchPattern: numberSearchPattern,
      },
    ],
    defaultPattern: "Y: North, X: East",
  });

  let magnaColombiaOesteOestePlanasFormat = new _FormatCoordinate({
    name: "Magna Sirgas Oeste Oeste Planas (EPSG:3114)",
    conversionInfo: {
      spatialReference: new _SpatialReference({
        wkid: 3114,
      }),
      reverseConvert: function (string, format) {
        var parts = string.split(",");
        return new _Point({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          spatialReference: {
            wkid: 3114,
          },
        });
      },
    },
    coordinateSegments: [
      {
        alias: "East",
        description: "Este",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "North",
        description: "Norte",
        searchPattern: numberSearchPattern,
      },
    ],
    defaultPattern: "Norte: North, Este: East",
  });

  let magnaColombiaOestePlanasFormat = new _FormatCoordinate({
    name: "Magna Sirgas Oeste Planas (EPSG:3115)",
    conversionInfo: {
      spatialReference: new _SpatialReference({
        wkid: 3115,
      }),
      reverseConvert: function (string, format) {
        var parts = string.split(",");
        return new _Point({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          spatialReference: {
            wkid: 3115,
          },
        });
      },
    },
    coordinateSegments: [
      {
        alias: "East",
        description: "Este",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "North",
        description: "Norte",
        searchPattern: numberSearchPattern,
      },
    ],
    defaultPattern: "Norte: North, Este: East",
  });

  let magnaColombiaBogotaPlanasFormat = new _FormatCoordinate({
    name: "Magna Sirgas Bogotá Planas (EPSG:3116)",
    conversionInfo: {
      spatialReference: new _SpatialReference({
        wkid: 3116,
      }),
      reverseConvert: function (string, format) {
        var parts = string.split(",");
        return new _Point({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          spatialReference: {
            wkid: 3116,
          },
        });
      },
    },
    coordinateSegments: [
      {
        alias: "East",
        description: "Este",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "North",
        description: "Norte",
        searchPattern: numberSearchPattern,
      },
    ],
    defaultPattern: "Norte: North, Este: East",
  });

  let magnaColombiaEsteCentralPlanasFormat = new _FormatCoordinate({
    name: "Magna Sirgas Este Central Planas (EPSG:3117)",
    conversionInfo: {
      spatialReference: new _SpatialReference({
        wkid: 3117,
      }),
      reverseConvert: function (string, format) {
        var parts = string.split(",");
        return new _Point({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          spatialReference: {
            wkid: 3117,
          },
        });
      },
    },
    coordinateSegments: [
      {
        alias: "East",
        description: "Este",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "North",
        description: "Norte",
        searchPattern: numberSearchPattern,
      },
    ],
    defaultPattern: "Norte: North, Este: East",
  });

  let magnaColombiaEstePlanasFormat = new _FormatCoordinate({
    name: "Magna Sirgas Este Planas (EPSG:3118)",
    conversionInfo: {
      spatialReference: new _SpatialReference({
        wkid: 3118,
      }),
      reverseConvert: function (string, format) {
        var parts = string.split(",");
        return new _Point({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          spatialReference: {
            wkid: 3118,
          },
        });
      },
    },
    coordinateSegments: [
      {
        alias: "East",
        description: "Este",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "North",
        description: "Norte",
        searchPattern: numberSearchPattern,
      },
    ],
    defaultPattern: "Norte: North, Este: East",
  });

  let formatsCollection = new _Collection();
  formatsCollection.addMany([
    magnaColombiaGeoFormat,
    WGS84Format,
    webMercatorFormat,
    magnaColombiaOesteOestePlanasFormat,
    magnaColombiaOestePlanasFormat,
    magnaColombiaBogotaPlanasFormat,
    magnaColombiaEsteCentralPlanasFormat,
    magnaColombiaEstePlanasFormat,
  ]);

  measurePoint.formats = formatsCollection;

  // Print
  printTask = new _PrintTask({
    url: URL_Print_Services,
  });

  // Time
  sliderTime = new _Slider({
    container: "sliderTime",
    min: vgv_lstAnios[0],
    max: vgv_lstAnios[vgv_lstAnios.length - 1],
    values: [vgv_lstAnios[0]],
    step: 1,
  });

  sliderTimeRange = new _Slider({
    container: "sliderTimeRange",
    min: vgv_lstAnios[0],
    max: vgv_lstAnios[vgv_lstAnios.length - 1],
    values: [vgv_lstAnios[0], vgv_lstAnios[vgv_lstAnios.length - 1]],
    steps: 1,
    snapOnClickEnabled: false,
    visibleElements: {
      labels: true,
      // rangeLabels: true
    },
  });

  sliderTimeRange.on(["thumb-change", "thumb-drag"], function () {
    $("#textSliderTimeRange").text(
      "Rango de años a calcular (" +
        sliderTimeRange.values[0].toString() +
        " - " +
        sliderTimeRange.values[1].toString() +
        ")"
    );
  });

  // Agregar los widgets en la pantalla principal
  view.ui.padding = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 20,
  };
  view.ui.add([
    {
      component: home,
      position: "bottom-right",
      index: 0,
    },
    {
      component: zoom,
      position: "bottom-right",
      index: 1,
    },
    {
      component: track,
      position: "bottom-right",
      index: 2,
    },
    {
      component: compass,
      position: "bottom-right",
      index: 3,
    },
    {
      component: scaleBar,
      position: "bottom-right",
      index: 4,
    },
    {
      component: layerListWigdet,
      position: "bottom-left",
      index: 0,
    },
    {
      component: baseMapExpand,
      position: "top-right",
      index: 0,
    },
    {
      component: sketchExpand,
      position: "top-right",
      index: 1,
    },
    {
      component: LegendExpand,
      position: "top-right",
      index: 2,
    },
    {
      component: attribution,
      position: "manual",
      index: 0,
    },
  ]);

  // Manejo de popups
  view.popup.defaultPopupTemplateEnabled = true;
  view.popup.watch("selectedFeature", function (gra) {
    if (gra) {
      view.graphics.removeAll();
      var h = view.highlightOptions;

      gra.symbol = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [h.color.r, h.color.g, h.color.b, 0.1],
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [h.color.r, h.color.g, h.color.b, h.color.a],
          width: 1,
        },
      };
      view.graphics.add(gra);
    } else {
      view.graphics.removeAll();
    }
  });

  // Contraer los widgets
  expandWidgets = [LegendExpand, sketchExpand, baseMapExpand];

  baseMapExpand.watch("expanded", function () {
    collapseExpand(baseMapExpand);
  });
  LegendExpand.watch("expanded", function () {
    collapseExpand(LegendExpand);
  });
  sketchExpand.watch("expanded", function () {
    collapseExpand(sketchExpand);
  });

  layerListWigdet.on("trigger-action", function (event) {
    let tLayer = event.item.layer;
    let id = event.action.id;

    if (id === "full-extent") {
      let extent = tLayer.fullExtent;
      if (
        extent.ymax == 90 &&
        extent.ymin == -90 &&
        extent.xmax == 180 &&
        extent.xmin == -180
      ) {
        home.viewModel.go();
      } else {
        view.goTo(tLayer.fullExtent);
      }
    } else if (id === "delete-layer") {
      collapseExpand(null);
      closeTabla();

      if (current_layers.indexOf(tLayer.id) != -1) {
        hideLayer(tLayer.id);
      }

      removeOptionSwipe(tLayer);
      map.remove(tLayer);
    } else if (id === "tabla-layer") {
      collapseExpand(null);

      loading = $.dialog({
        title: "",
        content: "",
        onContentReady: function () {
          this.showLoading(false);
        },
      });

      if (tLayer.type == "feature") {
        generateTableFeature(tLayer);
      } else if (tLayer.type == "map-image") {
        generateTableMapServer(tLayer);
      }
    } else if (id === "tabla-layer-default") {
      collapseExpand(null);

      loading = $.dialog({
        title: "",
        content: "",
        onContentReady: function () {
          this.showLoading(false);
        },
      });

      generateTableDefault(tLayer);
    } else if (id === "chart-layer") {
      collapseExpand(null);
      generateDataChart(tLayer);
    } else if (id === "increase-opacity") {
      if (tLayer.opacity < 1) {
        tLayer.opacity += 0.1;
      }
    } else if (id === "decrease-opacity") {
      if (tLayer.opacity > 0) {
        tLayer.opacity -= 0.1;
      }
    }
  });
}

function defineActions(event) {
  var item = event.item;

  let actionFullExtent = [
    {
      title: "Mapa completo",
      className: "esri-icon-globe",
      id: "full-extent",
    },
  ];

  let actionTable = [
    {
      title: "Ver tabla",
      className: "esri-icon-table",
      id: "tabla-layer",
    },
  ];

  let actionTableDefault = [
    {
      title: "Ver tabla",
      className: "esri-icon-table",
      id: "tabla-layer-default",
    },
  ];

  let actionChart = [
    {
      title: "Ver gráficas",
      className: "esri-icon-chart",
      id: "chart-layer",
    },
  ];

  let actionTransparency = [
    {
      title: "Reducir transparencia",
      className: "esri-icon-up",
      id: "increase-opacity",
    },
    {
      title: "Aumentar transparencia",
      className: "esri-icon-down",
      id: "decrease-opacity",
    },
  ];

  let actionDelete = [
    {
      title: "Borrar capa",
      className: "esri-icon-trash",
      id: "delete-layer",
    },
  ];

  let itemConfigLayers = config_layers.filter(function (element) {
    return element.ID_SERVICIO == item.layer.id.toString();
  });

  if (consulta_layers.indexOf(item.layer.id.toString()) != -1) {
    item.actionsSections = [
      actionFullExtent,
      actionTable,
      actionChart,
      actionTransparency,
      actionDelete,
    ];
  } else if (itemConfigLayers.length > 0) {
    item.actionsSections = [
      actionFullExtent,
      actionTableDefault,
      actionTransparency,
      actionDelete,
    ];
  } else {
    item.actionsSections = [
      actionFullExtent,
      actionTable,
      actionTransparency,
      actionDelete,
    ];
  }
}

function collapseExpand(widgetExpand) {
  for (const widget of expandWidgets) {
    if (widget !== widgetExpand) {
      if (widget.expanded) {
        widget.collapse();
      }
    }
  }
}

/* carga de elementos */

function loadSelectMultiple() {
  // Carga los Select Fijos
  buildSelectSingle("selectFiltro_Anio", vgv_lstAnios);
  $("#selectFiltro_Anio").val($("#selectFiltro_Anio option:eq(1)").val());

  buildSelectImpresion("selectFiltro_Variable", vgv_lstVariable);
  buildSelectImpresion("plantillaImpresion", vgv_lstImpresion);

  let selObjHecho = {
    domElement: "selectFiltro_Hecho",
    valueList: vgv_lstHechos,
    codeList: "code",
    descList: "name",
    defaultText: "Todos los Hechos",
    subText: null,
  };
  let selObjSexo = {
    domElement: "selectFiltro_Genero",
    valueList: vgv_lstSexo,
    codeList: "code",
    descList: "name",
    defaultText: "Todos los Géneros",
    subText: null,
  };
  let selObjEtnia = {
    domElement: "selectFiltro_Etnia",
    valueList: vgv_lstEtnia,
    codeList: "code",
    descList: "name",
    defaultText: "Todas las Etnias",
    subText: null,
  };
  let selObjCicloVital = {
    domElement: "selectFiltro_CicloVital",
    valueList: vgv_lstCicloVital,
    codeList: "code",
    descList: "name",
    defaultText: "Todos los Ciclos",
    subText: null,
  };
  let selObjDiscapacidad = {
    domElement: "selectFiltro_Discapacidad",
    valueList: vgv_lstDiscapacidad,
    codeList: "code",
    descList: "name",
    defaultText: "Todas las Discapacidades",
    subText: null,
  };

  buildSelectMultiple(selObjHecho);
  buildSelectMultiple(selObjSexo);
  buildSelectMultiple(selObjEtnia);
  buildSelectMultiple(selObjCicloVital);
  buildSelectMultiple(selObjDiscapacidad);

  let selObjDepartamentos = {
    domElement: "selectFiltro_Departamento",
    valueList: vgv_lstDepartamentos,
    codeList: "DANE_DEPTO",
    descList: "DEPARTAMENTO",
    defaultText: "Todos los Dptos",
    subText: null,
  };
  let selObjMunicipios = {
    domElement: "selectFiltro_Municipios",
    valueList: vgv_lstMunicipios,
    codeList: "DANE_MUNICIPIO",
    descList: "MUNICIPIO",
    defaultText: "Todos los Mpios",
    subText: "DEPARTAMENTO",
  };
  let selObjDT = {
    domElement: "selectFiltro_DT",
    valueList: vgv_lstDT,
    codeList: "COD_TERRITORIAL",
    descList: "DIR_TERRITORIAL",
    defaultText: "Todas las DT",
    subText: null,
  };
  let selObjPDET = {
    domElement: "selectFiltro_PDET",
    valueList: vgv_lstPDET,
    codeList: "COD_PDET",
    descList: "NOMBRE_PDET",
    defaultText: "Todos los PDET",
    subText: null,
  };
  buildSelectMultiple(selObjDepartamentos);
  buildSelectMultiple(selObjMunicipios);
  buildSelectMultiple(selObjDT);
  buildSelectMultiple(selObjPDET);
}

function cambioFiltroGeografico() {
  let filtroGeograficoSeleccionado = $("#selectFiltro_Geografico").val();

  if (filtroGeograficoSeleccionado == "filtroDepartamento") {
    $("#divFiltroGeograficoDT").hide();
    $("#divFiltroGeograficoPDET").hide();
    $("#divFiltroGeograficoMunicipio").hide();
    $("#divFiltroGeograficoDepartamento").show();
  } else if (filtroGeograficoSeleccionado == "filtroMunicipal") {
    $("#divFiltroGeograficoDT").hide();
    $("#divFiltroGeograficoPDET").hide();
    $("#divFiltroGeograficoDepartamento").show();
    $("#divFiltroGeograficoMunicipio").show();
  } else if (filtroGeograficoSeleccionado == "filtroDT") {
    $("#divFiltroGeograficoPDET").hide();
    $("#divFiltroGeograficoDepartamento").hide();
    $("#divFiltroGeograficoMunicipio").hide();
    $("#divFiltroGeograficoDT").show();
  } else if (filtroGeograficoSeleccionado == "filtroPDET") {
    $("#divFiltroGeograficoDT").hide();
    $("#divFiltroGeograficoDepartamento").hide();
    $("#divFiltroGeograficoMunicipio").hide();
    $("#divFiltroGeograficoPDET").show();
  } else {
    alerta("Debe seleccionar un tipo de selección espacial");
  }
}

function loadServicesUARIV() {
  loadConfigLayers();
  loadListasServices();
  loadFechaCorte();
}

function loadConfigLayers() {
  $.ajax({
    url: "./config/layers.json",
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data.status && data.servicios) {
        for (const element of data.servicios) {
          if (
            config_layers.find(function (item) {
              return item.ID_SERVICIO == element.ID_SERVICIO;
            }) == null &&
            element.ID_CATEGORIA != categoriaBaseOcultos
          ) {
            config_layers.push(element);
          } else if (
            base_layers.find(function (item) {
              return item.ID_SERVICIO == element.ID_SERVICIO;
            }) == null &&
            element.ID_CATEGORIA == categoriaBaseOcultos
          ) {
            base_layers.push(element);
          }
        }
        reporteUso("catalogo", "", "load");
        gotoAgregar();
      } else {
        alerta("Problema iniciando el catalogo de mapas en cache");
      }
    },
    error: function (xhr, status, error) {
      alerta("Problema iniciando el catalogo de mapas en cache");
      console.log(error);
    },
  });
}

function loadListasServices() {
  $.ajax({
    url: URL_DT_Services,
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Descomprimir los datos
      let dataPakoJSON = splitDataUncompress(data);

      let tmpDepartamentos = [];
      let tmpDepartamentosDT = [];
      let tmpDepartamentosPDET = [];
      let tmpMunicipios = [];
      let tmpMunicipiosDT = [];
      let tmpMunicipiosPDET = [];
      let tmpDT = [];
      let tmpPDET = [];

      for (const element of dataPakoJSON) {
        element.DEPARTAMENTO = element.DEPARTAMENTO.toUpperCase();
        element.MUNICIPIO = element.MUNICIPIO.toUpperCase();
        element.DIR_TERRITORIAL = element.DIR_TERRITORIAL.toUpperCase();

        if (tmpDepartamentos.indexOf(element.DANE_DEPTO) == -1) {
          tmpDepartamentos.push(element.DANE_DEPTO);
          vgv_lstDepartamentos.push({
            DANE_DEPTO: element.DANE_DEPTO,
            DEPARTAMENTO: element.DEPARTAMENTO,
          });
        }

        if (tmpMunicipios.indexOf(element.DANE_MUNICIPIO) == -1) {
          tmpMunicipios.push(element.DANE_MUNICIPIO);
          vgv_lstMunicipios.push({
            DANE_DEPTO: element.DANE_DEPTO,
            DEPARTAMENTO: element.DEPARTAMENTO,
            DANE_MUNICIPIO: element.DANE_MUNICIPIO,
            MUNICIPIO: element.MUNICIPIO,
          });
        }

        if (
          tmpDT.indexOf(element.COD_TERRITORIAL) == -1 &&
          parseInt(element.COD_TERRITORIAL) < 100
        ) {
          tmpDT.push(element.COD_TERRITORIAL);
          vgv_lstDT.push({
            COD_TERRITORIAL: element.COD_TERRITORIAL,
            DIR_TERRITORIAL: element.DIR_TERRITORIAL,
          });
        } else if (
          tmpPDET.indexOf(element.COD_TERRITORIAL) == -1 &&
          parseInt(element.COD_TERRITORIAL) >= 100
        ) {
          tmpPDET.push(element.COD_TERRITORIAL);
          vgv_lstPDET.push({
            COD_PDET: element.COD_TERRITORIAL,
            NOMBRE_PDET: element.DIR_TERRITORIAL,
          });
        }

        if (
          tmpDepartamentosDT.indexOf(
            element.DANE_DEPTO + "-" + element.COD_TERRITORIAL
          ) == -1 &&
          parseInt(element.COD_TERRITORIAL) < 100
        ) {
          tmpDepartamentosDT.push(
            element.DANE_DEPTO + "-" + element.COD_TERRITORIAL
          );
          vgv_lstDepartamentosDT.push({
            COD_TERRITORIAL: element.COD_TERRITORIAL,
            DIR_TERRITORIAL: element.DIR_TERRITORIAL,
            DANE_DEPTO: element.DANE_DEPTO,
            DEPARTAMENTO: element.DEPARTAMENTO,
          });
        }

        if (
          tmpDepartamentosPDET.indexOf(
            element.DANE_DEPTO + "-" + element.COD_TERRITORIAL
          ) == -1 &&
          parseInt(element.COD_TERRITORIAL) >= 100
        ) {
          tmpDepartamentosPDET.push(
            element.DANE_DEPTO + "-" + element.COD_TERRITORIAL
          );
          vgv_lstDepartamentosPDET.push({
            COD_PDET: element.COD_TERRITORIAL,
            NOMBRE_PDET: element.DIR_TERRITORIAL,
            DANE_DEPTO: element.DANE_DEPTO,
            DEPARTAMENTO: element.DEPARTAMENTO,
          });
        }

        if (
          tmpMunicipiosDT.indexOf(element.DANE_MUNICIPIO) == -1 &&
          parseInt(element.COD_TERRITORIAL) < 100
        ) {
          tmpMunicipiosDT.push(element.DANE_MUNICIPIO);
          vgv_lstMunicipiosDT.push({
            COD_TERRITORIAL: element.COD_TERRITORIAL,
            DIR_TERRITORIAL: element.DIR_TERRITORIAL,
            DANE_DEPTO: element.DANE_DEPTO,
            DEPARTAMENTO: element.DEPARTAMENTO,
            DANE_MUNICIPIO: element.DANE_MUNICIPIO,
            MUNICIPIO: element.MUNICIPIO,
          });
        }

        if (
          tmpMunicipiosPDET.indexOf(element.DANE_MUNICIPIO) == -1 &&
          parseInt(element.COD_TERRITORIAL) >= 100
        ) {
          tmpMunicipiosPDET.push(element.DANE_MUNICIPIO);
          vgv_lstMunicipiosPDET.push({
            COD_PDET: element.COD_TERRITORIAL,
            NOMBRE_PDET: element.DIR_TERRITORIAL,
            DANE_DEPTO: element.DANE_DEPTO,
            DEPARTAMENTO: element.DEPARTAMENTO,
            DANE_MUNICIPIO: element.DANE_MUNICIPIO,
            MUNICIPIO: element.MUNICIPIO,
          });
        }
      }

      vgv_lstDepartamentos.sort(dynamicSort("DEPARTAMENTO"));
      vgv_lstDepartamentosDT.sort(
        dynamicSortMultiple("DIR_TERRITORIAL", "DEPARTAMENTO")
      );
      vgv_lstDepartamentosPDET.sort(
        dynamicSortMultiple("NOMBRE_PDET", "DEPARTAMENTO")
      );

      vgv_lstDT.sort(dynamicSort("DIR_TERRITORIAL"));
      vgv_lstPDET.sort(dynamicSort("NOMBRE_PDET"));

      vgv_lstMunicipios.sort(dynamicSortMultiple("DEPARTAMENTO", "MUNICIPIO"));
      vgv_lstMunicipiosDT.sort(
        dynamicSortMultiple("DIR_TERRITORIAL", "DEPARTAMENTO", "MUNICIPIO")
      );
      vgv_lstMunicipiosPDET.sort(
        dynamicSortMultiple("NOMBRE_PDET", "DEPARTAMENTO", "MUNICIPIO")
      );

      console.log("Carga de listados finalizada");
    },
    error: function (xhr, status, error) {
      alerta("No se pudieron cargar los datos desde la Base de Datos.");
      console.log(error);
    },
  });
}

function loadFechaCorte() {
  var queryTask = new _QueryTask({
    url: URL_RUV_FECHACORTE,
  });

  var query = new _Query();
  query.returnGeometry = false;
  query.outFields = ["*"];
  query.where = "1=1";

  queryTask.execute(query).then(
    function (results) {
      let infoVGV = results.features[0].attributes;
      FechaCorte = infoVGV.RUV_CFECHA;
      $("#FechaCorteVGV").html("FECHA DE CORTE: " + infoVGV.RUV_CFECHA);
      $("#CountPersonasVGV").html(
        "VÍCTIMAS CONFLICTO ARMADO: " + formatNumber(infoVGV.RUV_NPERSONAS)
      );
      $("#CountSujetosVGV").html(
        "SUJETOS DE ATENCIÓN: " + formatNumber(infoVGV.RUV_NSUJETOS)
      );
      $("#CountEventosVGV").html(
        "EVENTOS: " + formatNumber(infoVGV.RUV_NEVENTOS)
      );

      $("#DefinitionPersonasVGV").html(infoVGV.RUV_CPERSONAS);
      $("#DefinitionSujetosVGV").html(infoVGV.RUV_CSUJETOS);
      $("#DefinitionEventosVGV").html(infoVGV.RUV_CEVENTOS);
    },
    function (error) {
      console.log("Error FechaCorte: ", error);
    }
  );
}

function loadDomainsVGV() {
  VGV_TABLA_DATOS = new _FeatureLayer({
    url: URL_RUV_DATOS,
  });
  VGV_TABLA_DATOS.load().then(function () {
    const fields = VGV_TABLA_DATOS.sourceJSON.fields;
    fields.forEach((field) => {
      switch (field.name) {
        case "RUV_NHECHO":
          vgv_lstHechos = field.domain.codedValues;
          break;
        case "RUV_NSEXO":
          vgv_lstSexo = field.domain.codedValues;
          break;
        case "RUV_NETNIA":
          vgv_lstEtnia = field.domain.codedValues;
          break;
        case "RUV_NDISCAPACIDAD":
          vgv_lstDiscapacidad = field.domain.codedValues;
          break;
        case "RUV_NCICLOVITAL":
          vgv_lstCicloVital = field.domain.codedValues;
          break;

        default:
          break;
      }
    });
    loadSelectMultiple();
  });
}

function loadLabelsGeo() {
  for (let index = 0; index < base_layers.length; index++) {
    const element = base_layers[index];
    if (element.CATEGORIA == "Base" && element.TIPO == "MapImageLayer") {
      const tLayer = new _MapImageLayer({
        url: element.URL,
        title: element.CATEGORIA + "_" + element.NOMBRE,
        id: element.CATEGORIA + "_" + element.NOMBRE,
        visible: false,
        legendEnabled: false,
        listMode: "hide",
      });
      map.add(tLayer);
      break;
    }
  }
}

function loadBaseGeografica(nameLayer) {
  if (nameLayer == nameLayerDepartamentos) {
    loadGeoDptos();
  } else if (nameLayer == nameLayerMunicipios) {
    loadGeoMpios();
  } else if (nameLayer == nameLayerDT) {
    loadGeoDT();
  } else if (nameLayer == nameLayerPDET) {
    loadGeoPDET();
  }
}

function loadGeoDT() {
  const geoDT = new _GeoJSONLayer({
    url: "./files/geo/DT.json",
    copyright: "Unidad para las Víctimas",
    title: nameLayerDT,
    id: nameLayerDT,
    outFields: ["*"],
    visible: false,
    legendEnabled: false,
    listMode: "hide",
  });
  map.add(geoDT);
}

function loadGeoPDET() {
  const geoPDET = new _GeoJSONLayer({
    url: "./files/geo/PDET.json",
    copyright: "Unidad para las Víctimas",
    title: nameLayerPDET,
    id: nameLayerPDET,
    outFields: ["*"],
    visible: false,
    legendEnabled: false,
    listMode: "hide",
  });
  map.add(geoPDET);
}

function loadGeoDptos() {
  const geoDptos = new _GeoJSONLayer({
    url: "./files/geo/Dptos.json",
    copyright: "Unidad para las Víctimas",
    title: nameLayerDepartamentos,
    id: nameLayerDepartamentos,
    outFields: ["*"],
    visible: false,
    legendEnabled: false,
    listMode: "hide",
  });
  map.add(geoDptos);
}

function loadGeoMpios() {
  const geoMpios = new _GeoJSONLayer({
    url: "./files/geo/Mpios.json",
    copyright: "Unidad para las Víctimas",
    title: nameLayerMunicipios,
    id: nameLayerMunicipios,
    outFields: ["*"],
    visible: false,
    legendEnabled: false,
    listMode: "hide",
  });
  map.add(geoMpios);
}

/* Buscar los datos en la base de datos */

function getSqlParameter(domFilter, nombreCampo) {
  let parameterSelected = $("#" + domFilter + " option:selected");
  let parameterOptions = $("#" + domFilter + " option");

  if (parameterSelected.length < parameterOptions.length) {
    let parametrosSeleccionados = parameterSelected.map(function (a, item) {
      return parseInt(item.value);
    });

    let strSQL = nombreCampo + " IN (";
    strSQL += parametrosSeleccionados.toArray().toString();
    strSQL += ") AND ";
    return strSQL;
  } else {
    return "";
  }
}

function defineSqlVGV(Anio, filtroGeografico, variableRUV) {
  let tableRUV;
  let popupContent;

  let strFrom =
    ", SUM(RUV_N" +
    $("#selectFiltro_Variable").val() +
    ") AS VGV_NVALOR FROM GIS2.RUV.RUV_DATOS ";
  let strWhere = "WHERE RUV_CVIGENCIA = 'YYYY' AND ";
  strWhere += getSqlParameter("selectFiltro_Hecho", "RUV_NHECHO");
  strWhere += getSqlParameter("selectFiltro_Genero", "RUV_NSEXO");
  strWhere += getSqlParameter("selectFiltro_Etnia", "RUV_NETNIA");
  strWhere += getSqlParameter("selectFiltro_Discapacidad", "RUV_NDISCAPACIDAD");
  strWhere += getSqlParameter("selectFiltro_CicloVital", "RUV_NCICLOVITAL");
  if (filtroGeografico == "filtroDepartamento") {
    strFrom =
      strSQL_Dptos +
      " FROM GIS2.Publicacion.DEPARTAMENTOS G LEFT JOIN (SELECT DPTO_NCDGO" +
      strFrom;
    strWhere += getSqlParameter("selectFiltro_Departamento", "DPTO_NCDGO");
    strWhere +=
      " (1 = 1) GROUP BY DPTO_NCDGO) AS D ON G.DPTO_NCDGO = D.DPTO_NCDGO";
    tableRUV = "Departamentos";
    popupContent = `Durante el año <b>${Anio}</b> se presentaron <b>{VGV_NVALOR} ${variableRUV}</b> en el ${tableRUV} de <b>{VGV_CNMBR}</b>.`;
  } else if (filtroGeografico == "filtroMunicipal") {
    strFrom =
      strSQL_Mpios +
      " FROM GIS2.Publicacion.MUNICIPIOS G LEFT JOIN (SELECT MPIO_NCDGO" +
      strFrom;
    strWhere += getSqlParameter("selectFiltro_Municipios", "MPIO_NCDGO");
    strWhere +=
      " (1 = 1) GROUP BY MPIO_NCDGO) AS D ON G.MPIO_NCDGO = D.MPIO_NCDGO";
    tableRUV = "Municipios";
    popupContent = `Durante el año <b>${Anio}</b> se presentaron <b>{VGV_NVALOR} ${variableRUV}</b> en el ${tableRUV} de <b>{VGV_CNMBR}</b>.`;
  } else if (filtroGeografico == "filtroDT") {
    strFrom =
      strSQL_DT +
      " FROM GIS2.Publicacion.DT G LEFT JOIN (SELECT DT_NCDGO" +
      strFrom;
    strWhere += getSqlParameter("selectFiltro_DT", "DT_NCDGO");
    strWhere += " (1 = 1) GROUP BY DT_NCDGO) AS D ON G.DT_NCDGO = D.DT_NCDGO";
    tableRUV = "DT";
    popupContent = `Durante el año <b>${Anio}</b> se presentaron <b>{VGV_NVALOR} ${variableRUV}</b> en el <b>{VGV_CNMBR}</b>.`;
  } else if (filtroGeografico == "filtroPDET") {
    strFrom =
      strSQL_PDET +
      " FROM GIS2.Publicacion.PDET G LEFT JOIN (SELECT PDET_NCDGO" +
      strFrom;
    strWhere += getSqlParameter("selectFiltro_PDET", "PDET_NCDGO");
    strWhere +=
      " (1 = 1) GROUP BY PDET_NCDGO) AS D ON G.PDET_NCDGO = D.PDET_NCDGO";
    tableRUV = "PDET";
    popupContent = `Durante el año <b>${Anio}</b> se presentaron <b>{VGV_NVALOR} ${variableRUV}</b> en el <b>{VGV_CNMBR}</b>.`;
  }

  let titleRUV = variableRUV + " por " + tableRUV + " para el año YYYY";
  let idLayerRUV =
    "Results_" + tableRUV + "_" + $("#selectFiltro_Variable").val() + "_YYYY";
  let strSqlVGV = strFrom + strWhere;

  return {
    idLayerRUV,
    titleRUV,
    strSqlVGV,
    tableRUV,
    popupContent,
  };
}

function createRenderer(featureLayer, subLayer, layerRUV) {
  let classificationMethod = $("#class-select-VGV").val();
  let numClasses = parseInt($("#num-classes-VGV").val());

  let color_1 = $("#styleRampColor1-VGV").val();
  let color_2 = $("#styleRampColor2-VGV").val();
  let color_3 = $("#styleRampColor3-VGV").val();
  const schemesVGV = getScheme(color_1, color_2, color_3);

  const params = {
    layer: featureLayer,
    field: "VGV_NVALOR",
    view: view,
    classificationMethod: classificationMethod,
    numClasses: numClasses,
    colorScheme: schemesVGV,
  };

  _colorRendererCreator
    .createClassBreaksRenderer(params)
    .then(function (rendererResponse) {
      rendererResponse.renderer.defaultLabel = "Sin Datos";
      rendererResponse.renderer.defaultSymbol.color.a = 0.7;
      subLayer.renderer = rendererResponse.renderer;

      map.add(layerRUV);
      addOptionSwipe(layerRUV);
      consulta_layers.push(layerRUV.id);

      const tLayerLabels = map.findLayerById(tLayerBaseLabelsId);
      map.reorder(tLayerLabels, map.layers.items.length);
      tLayerLabels.visible = true;

      if (loading.isOpen()) {
        loading.close();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function aplicarParametrosVGV() {
  let filtroGeografico = $("#selectFiltro_Geografico").val();

  if (filtroGeografico == "filtroDepartamento") {
    if ($("#selectFiltro_Departamento option:selected").length == 0) {
      alerta("Debe seleccionar al menos un departamento");
      return;
    }
  } else if (filtroGeografico == "filtroMunicipal") {
    if ($("#selectFiltro_Municipios option:selected").length == 0) {
      alerta("Debe seleccionar al menos un municipio");
      return;
    }
  } else if (filtroGeografico == "filtroDT") {
    if ($("#selectFiltro_DT option:selected").length == 0) {
      alerta("Debe seleccionar al menos una dirección territorial");
      return;
    }
  } else if (filtroGeografico == "filtroPDET") {
    if ($("#selectFiltro_PDET option:selected").length == 0) {
      alerta("Debe seleccionar al menos un PDET");
      return;
    }
  }

  loading = $.dialog({
    title: "",
    content: "",
    onContentReady: function () {
      this.showLoading(false);
    },
  });

  let variableRUV = $("#selectFiltro_Variable option:selected").text();
  let Anio = $("#selectFiltro_Anio").val();

  let idLayerRUV, titleRUV, strSqlVGV, tableRUV, popupContent;
  ({ idLayerRUV, titleRUV, strSqlVGV, tableRUV, popupContent } = defineSqlVGV(
    Anio,
    filtroGeografico,
    variableRUV
  ));

  idLayerRUV = idLayerRUV.replace("YYYY", Anio);
  titleRUV = titleRUV.replace("YYYY", Anio);
  strSqlVGV = strSqlVGV.replace("YYYY", Anio);

  removeLayer(idLayerRUV);

  const layerRUV = new _MapImageLayer({
    url: URL_RUV,
    title: titleRUV,
    id: idLayerRUV,
    anio: Anio,
    visible: true,
    sublayers: [
      {
        title: titleRUV,
        id: 0,
        idRUV: idLayerRUV,
        layerOrigen: tableRUV,
        variableOrigen: variableRUV,
        opacity: 0.8,
        listMode: "hide",
        source: {
          type: "data-layer",
          dataSource: {
            type: "query-table",
            workspaceId: "CONSULTA_RUV",
            query: strSqlVGV,
            geometryType: "polygon",
            spatialReference: {
              wkid: 4326,
            },
            oidFields: "objectid",
          },
        },
      },
    ],
  });

  const subLayerRUV = layerRUV.sublayers.find(function (sublayer) {
    return sublayer.id === 0;
  });

  subLayerRUV
    .createFeatureLayer()
    .then(function (eventosFeatureLayer) {
      return eventosFeatureLayer.load();
    })
    .then(function (featureLayer) {
      createRenderer(featureLayer, subLayerRUV, layerRUV);
    });

  subLayerRUV.popupTemplate = {
    title: "<b>" + titleRUV + "</b>",
    content: popupContent,
    fieldInfos: [
      {
        fieldName: "VGV_NVALOR",
        format: {
          digitSeparator: true,
          places: 0,
        },
      },
      {
        fieldName: "VGV_CNMBR",
      },
    ],
  };

  closeParametrosVGV();
}

function limpiarParametrosVGV() {
  let listSelect = [
    "selectFiltro_Hecho",
    "selectFiltro_Genero",
    "selectFiltro_Etnia",
    "selectFiltro_CicloVital",
    "selectFiltro_Discapacidad",
    "selectFiltro_Departamento",
    "selectFiltro_Municipios",
    "selectFiltro_DT",
    "selectFiltro_PDET",
  ];

  for (const element of listSelect) {
    $("#" + element).multiselect("selectAll", false);
    $("#" + element).multiselect("updateButtonText");
  }

  $("#selectFiltro_Anio").prop("selectedIndex", 0);
  $("#selectFiltro_Variable").prop("selectedIndex", 0);
  $("#selectFiltro_Geografico").prop("selectedIndex", 0);
  $("#selectFiltro_Geografico").trigger("change");
}

function closeParametrosVGV() {
  $("#collapseFilterVGV").removeClass("in");
  $("#panelFilterVGV_close").addClass("visible-mobile-only");
  $("#panelFilterVGV_title").addClass("visible-mobile-only");
}

/* Tiempo */

function createTimeVGV() {
  // Valida el anio inicial y final
  if (sliderTimeRange.values[0] == sliderTimeRange.values[1]) {
    alerta(
      "El año de inicio y fin del deslizador del tiempo no pueden ser el mismo"
    );
  } else {
    let filtroGeografico = $("#selectFiltro_Geografico").val();

    if (filtroGeografico == "filtroDepartamento") {
      if ($("#selectFiltro_Departamento option:selected").length == 0) {
        alerta("Debe seleccionar al menos un departamento");
        return;
      }
    } else if (filtroGeografico == "filtroMunicipal") {
      if ($("#selectFiltro_Municipios option:selected").length == 0) {
        alerta("Debe seleccionar al menos un municipio");
        return;
      }
    } else if (filtroGeografico == "filtroDT") {
      if ($("#selectFiltro_DT option:selected").length == 0) {
        alerta("Debe seleccionar al menos una dirección territorial");
        return;
      }
    } else if (filtroGeografico == "filtroPDET") {
      if ($("#selectFiltro_PDET option:selected").length == 0) {
        alerta("Debe seleccionar al menos un PDET");
        return;
      }
    }

    loading = $.dialog({
      title: "",
      content: "",
      onContentReady: function () {
        this.showLoading(false);
      },
    });

    // obtiene el anio inicial y final
    sliderTime.min = sliderTimeRange.values[0];
    sliderTime.max = sliderTimeRange.values[1];

    // Oculta el botón para que no ejecuten de nuevo el comando
    $("#createTimeVGV").hide();

    current_reportes = arrayRemove(current_reportes, "TimeSlider");
    reporteUso(
      "TimeSlider",
      sliderTimeRange.values[0] + " - " + sliderTimeRange.values[1],
      "create"
    );

    let variableRUV = $("#selectFiltro_Variable option:selected").text();
    let idLayerRUV, titleRUV, strSqlVGV, tableRUV, popupContent;

    ({ idLayerRUV, titleRUV, strSqlVGV, tableRUV, popupContent } = defineSqlVGV(
      sliderTime.min,
      filtroGeografico,
      variableRUV
    ));

    idLayerRUV = idLayerRUV.replace("_YYYY", "");
    idLayerRUV = idLayerRUV.replace("Results_", "Time_");
    removeLayer(idLayerRUV);

    const layerTime = new _MapImageLayer({
      url: URL_RUV,
      title: titleRUV.replace(" para el año YYYY", ""),
      id: idLayerRUV,
      visible: true,
      listMode: "hide",
      sublayers: [],
    });

    let color_1 = $("#styleRampColor1-VGV").val();
    let color_2 = $("#styleRampColor2-VGV").val();
    let color_3 = $("#styleRampColor3-VGV").val();
    const schemesTime = getScheme(color_1, color_2, color_3);

    for (const idxAnio of vgv_lstAnios) {
      if (
        idxAnio >= sliderTimeRange.values[0] &&
        idxAnio <= sliderTimeRange.values[1]
      ) {
        let Anio = idxAnio;
        let titleAnio = titleRUV.replace("YYYY", Anio);
        let strSqlAnio = strSqlVGV.replace("YYYY", Anio);

        let defineSubLayer = {
          title: titleAnio,
          id: Anio,
          idRUV: idLayerRUV,
          layerOrigen: tableRUV,
          variableOrigen: variableRUV,
          opacity: 0.8,
          listMode: "hide",
          visible: false,
          source: {
            type: "data-layer",
            dataSource: {
              type: "query-table",
              workspaceId: "CONSULTA_RUV",
              query: strSqlAnio,
              geometryType: "polygon",
              spatialReference: {
                wkid: 4326,
              },
              oidFields: "objectid",
            },
          },
        };

        layerTime.sublayers.push(defineSubLayer);

        const subLayerTime = layerTime.sublayers.find(function (sublayer) {
          return sublayer.id === Anio;
        });

        subLayerTime.popupTemplate = {
          title: "<b>" + titleAnio + "</b>",
          content: popupContent,
          fieldInfos: [
            {
              fieldName: "VGV_NVALOR",
              format: {
                digitSeparator: true,
                places: 0,
              },
            },
            {
              fieldName: "VGV_CNMBR",
            },
          ],
        };

        subLayerTime
          .createFeatureLayer()
          .then(function (eventosFeatureLayer) {
            return eventosFeatureLayer.load();
          })
          .then(function (featureLayer) {
            createRendererTime(featureLayer, schemesTime, subLayerTime);
          });
      }
    }

    idLayerTime = idLayerRUV;
    map.add(layerTime);

    const tLayerLabels = map.findLayerById(tLayerBaseLabelsId);
    map.reorder(tLayerLabels, map.layers.items.length);
    tLayerLabels.visible = true;

    view
      .whenLayerView(layerTime)
      .then(function (layerView) {
        displayTimeVGV();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

function createRendererTime(featureLayer, schemesTime, subLayer) {
  let classificationMethod = $("#class-select-VGV").val();
  let numClasses = parseInt($("#num-classes-VGV").val());

  const params = {
    layer: featureLayer,
    field: "VGV_NVALOR",
    view: view,
    classificationMethod: classificationMethod,
    numClasses: numClasses,
    colorScheme: schemesTime,
  };

  _colorRendererCreator
    .createClassBreaksRenderer(params)
    .then(function (rendererResponse) {
      rendererResponse.renderer.defaultLabel = "Sin Datos";
      rendererResponse.renderer.defaultSymbol.color.a = 0.7;
      subLayer.renderer = rendererResponse.renderer;

      if (loading.isOpen()) {
        loading.close();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function displayTimeVGV() {
  try {
    sliderTime.on("thumb-drag", inputTimeHandler);

    setTimeYear(sliderTimeRange.values[0]);

    let layerTime = map.findLayerById(idLayerTime);
    const subLayerTime = layerTime.sublayers.find(function (sublayer) {
      return sublayer.id === sliderTime.min;
    });
    subLayerTime.visible = true;

    subLayerTime.when(function () {
      $("#sliderContainerTime").show();
      $("#legendTimeVGV").show();
      $("#deleteTimeVGV").show();
      $("#settingsTime").show();
      $("#helpTimeVGV").removeClass("in");

      if (loading.isOpen()) {
        loading.close();
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function deleteTimeVGV() {
  current_reportes = arrayRemove(current_reportes, "TimeSlider");
  reporteUso(
    "TimeSlider",
    sliderTimeRange.values[0] + " - " + sliderTimeRange.values[1],
    "delete"
  );

  removeLayer(idLayerTime);

  sliderTimeRange.values[0] = vgv_lstAnios[0];
  sliderTimeRange.values[1] = vgv_lstAnios[vgv_lstAnios.length - 1];

  sliderTime.min = sliderTimeRange.values[0];
  sliderTime.max = sliderTimeRange.values[1];

  stopAnimation();

  loopFull = false;
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
  try {
    let AnioTime = parseInt(Math.floor(value));
    var sliderValue = document.getElementById("sliderValue");
    sliderValue.innerHTML = AnioTime;
    if (loopFull) {
      $("#sliderTime").show();
      sliderTime.viewModel.setValue(0, AnioTime);
    }

    offLayersTime();
    onLayerTime(AnioTime);
  } catch (error) {
    console.error(error);
  }
}

function startAnimation() {
  try {
    stopAnimation();
    animation = animate(sliderTimeRange.values[0]);
    playButton.classList.add("toggled");
  } catch (error) {
    console.error(error);
  }
}

function stopAnimation() {
  try {
    if (!animation) {
      return;
    }

    animation.remove();
    animation = null;
    playButton.classList.remove("toggled");
  } catch (error) {
    console.error(error);
  }
}

function animate(startValue) {
  try {
    var animating = true;
    var value = startValue;

    var frame = function (timestamp) {
      if (!animating) {
        return;
      }

      value += 0.5;
      if (value > sliderTimeRange.values[1]) {
        value = sliderTimeRange.values[0];
        loopFull = true;
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
  } catch (error) {
    console.error(error);
  }
}

function inputTimeHandler(event) {
  try {
    stopAnimation();
    setTimeYear(event.value);
  } catch (error) {
    console.error(error);
  }
}

function offLayersTime() {
  let layerTime = map.findLayerById(idLayerTime);
  for (const idxAnio of vgv_lstAnios) {
    if (
      idxAnio >= sliderTimeRange.values[0] &&
      idxAnio <= sliderTimeRange.values[1]
    ) {
      const subLayerTime = layerTime.sublayers.find(function (sublayer) {
        return sublayer.id === idxAnio;
      });
      subLayerTime.visible = false;
    }
  }
}

function onLayerTime(Anio) {
  let layerTime = map.findLayerById(idLayerTime);
  const subLayerTime = layerTime.sublayers.find(function (sublayer) {
    return sublayer.id === Anio;
  });
  subLayerTime.visible = true;
}

/* Graficas */

function zChart() {
  $("#panelChartP").css("z-index", current_Zindex);
  current_Zindex = current_Zindex + 1;
}

function closeChart() {
  $("#panelChartP").removeClass("panelTablePSM");
  $("#panelChartP").hide();
  $("#labelParametro2Chart").hide();
  $("#settingsParametro2Chart").hide();

  $("#settingsVariableChart").val(
    $("#settingsVariableChart option:first").val()
  );
  $("#settingsParametro1Chart").val(
    $("#settingsParametro1Chart option:first").val()
  );
  $("#settingsParametro2Chart").val(
    $("#settingsParametro1Chart option:eq(1)").val()
  );
  $("#settingsTipoChart").val($("#settingsTipoChart option:first").val());

  vgv_graphic_hechos = [];
  Plotly.purge("chartFilterData");
}

function maxChart() {
  $("#panelChartP").toggleClass("panelTablePSM");
}

async function generateDataChart(tLayer) {
  let strWhere = "RUV_CVIGENCIA = '" + tLayer.anio + "' and DPTO_NCDGO <> 0";

  const queryHecho = groupDataVGV(strWhere, "RUV_NHECHO");
  const querySexo = groupDataVGV(strWhere, "RUV_NSEXO");
  const queryEtnia = groupDataVGV(strWhere, "RUV_NETNIA");
  const queryDiscapacidad = groupDataVGV(strWhere, "RUV_NDISCAPACIDAD");
  const queryCicloVital = groupDataVGV(strWhere, "RUV_NCICLOVITAL");

  try {
    let [
      dataVGVHecho,
      dataVGVSexo,
      dataVGVEtnia,
      dataVGVDiscapacidad,
      dataVGVCicloVital,
    ] = await Promise.all([
      VGV_TABLA_DATOS.queryFeatures(queryHecho).then((response) => {
        return response.features;
      }),
      VGV_TABLA_DATOS.queryFeatures(querySexo).then((response) => {
        return response.features;
      }),
      VGV_TABLA_DATOS.queryFeatures(queryEtnia).then((response) => {
        return response.features;
      }),
      VGV_TABLA_DATOS.queryFeatures(queryDiscapacidad).then((response) => {
        return response.features;
      }),
      VGV_TABLA_DATOS.queryFeatures(queryCicloVital).then((response) => {
        return response.features;
      }),
    ]);

    vgv_graphic_hechos = [];
    vgv_graphic_hechos.push({
      Parametros: "HECHO",
      DataGroup: processDataGroupVGV(dataVGVHecho, "RUV_NHECHO", vgv_lstHechos),
    });
    vgv_graphic_hechos.push({
      Parametros: "SEXO",
      DataGroup: processDataGroupVGV(dataVGVSexo, "RUV_NSEXO", vgv_lstSexo),
    });
    vgv_graphic_hechos.push({
      Parametros: "ETNIA",
      DataGroup: processDataGroupVGV(dataVGVEtnia, "RUV_NETNIA", vgv_lstEtnia),
    });
    vgv_graphic_hechos.push({
      Parametros: "DISCAPACIDAD",
      DataGroup: processDataGroupVGV(
        dataVGVDiscapacidad,
        "RUV_NDISCAPACIDAD",
        vgv_lstDiscapacidad
      ),
    });
    vgv_graphic_hechos.push({
      Parametros: "CICLO_VITAL",
      DataGroup: processDataGroupVGV(
        dataVGVCicloVital,
        "RUV_NCICLOVITAL",
        vgv_lstCicloVital
      ),
    });

    $("#tituloChart").text("Gráficos - " + tLayer.title);
    $("#panelChartP").data("idLayer", tLayer.id);
    $("#panelChartP").show();
    generateVisualChart();

    current_reportes = arrayRemove(current_reportes, "chart");
    reporteUso("chart", tLayer.id, "load");
  } catch (error) {
    console.log(error);
  }
}

function processDataGroupVGV(dataVGV, field, vgvList) {
  let dataGroupVGV = [];
  dataVGV.forEach((data) => {
    dataGroupVGV.push(data.attributes);
  });
  for (const element of vgvList) {
    for (const data of dataGroupVGV) {
      if (element.code == data[field]) {
        data.VAR_AGRUPACION = element.name;
        delete data[field];
      }
    }
  }
  return dataGroupVGV;
}

function groupDataVGV(strWhere, fieldGroup) {
  const query = new _Query();
  query.where = strWhere;
  query.returnGeometry = false;
  query.outFields = ["*"];
  query.outStatistics = [
    {
      onStatisticField: "RUV_NDECLARACION",
      outStatisticFieldName: "PER_DECLA",
      statisticType: "sum",
    },
    {
      onStatisticField: "RUV_NEVENTOS",
      outStatisticFieldName: "EVENTOS",
      statisticType: "sum",
    },
    {
      onStatisticField: "RUV_NOCURRENCIA",
      outStatisticFieldName: "PER_OCU",
      statisticType: "sum",
    },
  ];
  query.groupByFieldsForStatistics = [fieldGroup];
  return query;
}

function generateVisualChart() {
  let variableValueChart = $("#settingsVariableChart").val();
  let variableTextChart = $("#settingsVariableChart option:selected").text();

  let parametro1ValueChart = $("#settingsParametro1Chart").val();
  let parametro1TextChart = $(
    "#settingsParametro1Chart option:selected"
  ).text();

  let tipoValueChart = $("#settingsTipoChart").val();

  let dataGroupChart = vgv_graphic_hechos.filter(function (item) {
    return item.Parametros == parametro1ValueChart;
  })[0].DataGroup;

  let labelsGroupChart = dataGroupChart.map(function (item) {
    return item.VAR_AGRUPACION;
  });
  let variableGroupChart = dataGroupChart.map(function (item) {
    return item[variableValueChart];
  });

  Plotly.purge("chartFilterData");

  let orientationLeyend = window.innerWidth <= 1280 ? "h" : "v";
  let dataChart, layoutChart;

  if (tipoValueChart == "Pie" || tipoValueChart == "Donut") {
    dataChart = [
      {
        labels: labelsGroupChart,
        values: variableGroupChart,
        textposition: "inside",
        automargin: true,
        type: "pie",
      },
    ];

    if (tipoValueChart == "Donut") {
      dataChart[0].hole = 0.4;
    }

    layoutChart = {
      title: {
        text: variableTextChart + " por " + parametro1TextChart,
        font: {
          family: "Work Sans, sans-serif",
          size: 16,
        },
        xref: "paper",
        x: 0.5,
        y: 0.95,
      },
      autosize: true,
      margin: {
        t: 50,
        b: 0,
        l: 0,
        r: 50,
      },
      showlegend: true,
      legend: {
        orientation: orientationLeyend,
      },
    };
  } else if (tipoValueChart == "Bar") {
    let d3colors = Plotly.d3.scale.category20();
    let listColors = [];

    for (let idxLabels = 0; idxLabels < labelsGroupChart.length; idxLabels++) {
      listColors.push(d3colors(idxLabels));
    }

    dataChart = [
      {
        x: labelsGroupChart,
        y: variableGroupChart,
        marker: {
          color: listColors,
        },
        type: "bar",
      },
    ];

    layoutChart = {
      title: {
        text: variableTextChart + " por " + parametro1TextChart,
        font: {
          family: "Work Sans, sans-serif",
          size: 16,
        },
        xref: "paper",
        x: 0.5,
        y: 0.95,
      },
      autosize: true,
      margin: {
        l: 50,
        r: 0,
        b: 100,
        t: 50,
        pad: 4,
      },
    };
  }

  let config = {
    responsive: true,
    displayModeBar: true,
    locale: "es",
    displaylogo: false,
  };

  Plotly.newPlot("chartFilterData", dataChart, layoutChart, config);
}

/* tabla */

function zTabla() {
  $("#panelTableP").css("z-index", current_Zindex);
  current_Zindex = current_Zindex + 1;
}

function closeTabla() {
  $("#panelTableP").removeClass("panelTablePSM");
  $("#panelTableP").hide();
  if (tableFilterData) {
    tableFilterData.destroy();
    $("#panelTableP").data("nombreArchivo", null);
    $("#panelTableP").data("nombreTabla", null);
  }
}

function maxTabla() {
  $("#panelTableP").toggleClass("panelTablePSM");
}

function generateTableMapServer(tLayer) {
  if (tLayer.id.startsWith("Results_")) {
    const subLayer = tLayer.sublayers.find(function (sublayer) {
      return sublayer.id === 0;
    });

    generateTableFeature(subLayer);
  }
}

function generateTableFeature(tLayer) {
  const query = new _Query();
  query.where = "1=1";
  query.returnGeometry = false;
  query.outFields = ["*"];

  tLayer.queryFeatures(query).then(function (response) {
    current_reportes = arrayRemove(current_reportes, "table");
    reporteUso("table", tLayer.id, "load");

    let idLayer = tLayer.id == 0 ? tLayer.idRUV : tLayer.id;
    let tipoResultados = tLayer.layerOrigen;
    let tituloResultados = tLayer.variableOrigen;

    $("#panelTableP").data(
      "nombreArchivo",
      idLayer.split("_").slice(2).join("_")
    );
    $("#panelTableP").data("nombreTabla", tipoResultados);

    let TableFeatures = [];
    response.features.forEach((feature) => {
      TableFeatures.push(feature.attributes);
    });

    let TableFields = [];
    if (tipoResultados == "Departamentos") {
      TableFields = jsonCopy(tableDef_Dptos);
    } else if (tipoResultados == "Municipios") {
      TableFields = jsonCopy(tableDef_Mpios);
    } else if (tipoResultados == "DT") {
      TableFields = jsonCopy(tableDef_DT);
    } else if (tipoResultados == "PDET") {
      TableFields = jsonCopy(tableDef_PDET);
    }

    for (const tableField of TableFields) {
      if (tableField.field == "VGV_NVALOR") {
        tableField.topCalc = function (values, data, calcParams) {
          if (values && values.length) {
            var total = values.reduce((sum, x) => sum + (parseInt(x) || 0));
            return "Total: " + formatNumber(total);
          }
        };
      }
    }

    let widthTable = 0;
    for (const tableField of TableFields) {
      if (tableField.field == "VGV_NVALOR") {
        tableField.title = tituloResultados;
      }
      if (tableField.hasOwnProperty("width")) {
        widthTable += tableField.width;
      }
    }

    if (widthTable > 0) {
      $("#tableFilterData").css("min-width", widthTable.toString() + "px");
    } else {
      $("#tableFilterData").css("min-width", "100%");
    }

    let tableOptions = {
      layout: "fitColumns",
      layoutColumnsOnNewData: true,
      responsiveLayout: true,
      data: TableFeatures,
      columns: TableFields,
      placeholder: idLayer,
      selectable: 1,
      columnHeaderVertAlign: "middle",
      rowSelected: function (row) {
        selectTableFeatures(
          tableFilterData.options.placeholder.textContent,
          row.getData()["OBJECTID"]
        );
      },
    };

    tableFilterData = new Tabulator("#tableFilterData", tableOptions);

    if (loading.isOpen()) {
      loading.close();
    }

    zTabla();

    $("#tituloTabla").text("Tabla de atributos - " + tLayer.title);
    $("#panelTableP").show();
  });
}

function generateTableDefault(tLayer) {
  let query = {
    where: "1 = 1",
    outFields: ["*"],
    returnGeometry: false,
  };

  tLayer.queryFeatures(query).then(function (response) {
    let idLayer = tLayer.id;
    let fieldsLayer = tLayer.fields;

    let TableFields = [];
    let dateFields = [];
    let widthTable = 0;

    for (let field of fieldsLayer) {
      if (
        field.name == "OBJECTID" ||
        field.name == "Shape__Length" ||
        field.name == "Shape.LEN" ||
        field.name == "Shape__Area" ||
        field.name == "Shape.AREA"
      ) {
        // pass
      } else if (field.name == "OBJECTID") {
        TableFields.push({
          field: "OBJECTID",
          visible: false,
        });
      } else {
        let widthField = field.length;
        if (widthField < 30) {
          widthField = 150;
        } else {
          widthField = widthField * 3;
        }

        widthTable += widthField;

        let fieldDefinition = {
          field: field.name,
          title: field.alias,
          sorter: "string",
          visible: true,
          width: widthField,
        };

        if (field.type == "string") {
          fieldDefinition.headerFilter = "input";
          fieldDefinition.headerFilterPlaceholder = "Buscar " + field.alias;
        }

        if (field.type == "date") {
          dateFields.push(field.name);
        }

        TableFields.push(fieldDefinition);
      }
    }

    if (widthTable > 0.75 * window.innerWidth) {
      $("#tableFilterData").css("min-width", widthTable.toString() + "px");
    } else {
      $("#tableFilterData").css("min-width", "100%");
    }

    $("#panelTableP").data("nombreArchivo", idLayer);
    $("#panelTableP").data("nombreTabla", "Datos");

    let TableFeatures = [];
    response.features.forEach((feature) => {
      let attributeFeature = feature.attributes;
      if (dateFields.length > 0) {
        for (let field of dateFields) {
          attributeFeature[field] = getDateText(attributeFeature[field]);
        }
      }
      TableFeatures.push(attributeFeature);
    });

    tableFilterData = new Tabulator("#tableFilterData", {
      // autoColumns: true,
      layout: "fitColumns",
      layoutColumnsOnNewData: true,
      autoResize: true,
      responsiveLayout: true,
      data: TableFeatures,
      columns: TableFields,
      placeholder: idLayer,
      selectable: 1,
      columnHeaderVertAlign: "middle",
      rowSelected: function (row) {
        selectTableFeatures(
          tableFilterData.options.placeholder.textContent,
          row.getData()["OBJECTID"]
        );
      },
    });

    tableFilterData.redraw();

    if (loading.isOpen()) {
      loading.close();
    }

    current_reportes = arrayRemove(current_reportes, "table");
    reporteUso("table", tLayer.id, "load");

    zTabla();
    $("#tituloTabla").text("Tabla de atributos - " + tLayer.title);
    $("#panelTableP").show();
  });
}

function selectTableFeatures(idLayer, OBJECTID) {
  let tLayer = map.findLayerById(idLayer);
  if (tLayer) {
    let query = {
      where: "OBJECTID = " + OBJECTID,
      outFields: ["*"],
      returnGeometry: true,
    };

    if (tLayer.type == "map-image" && tLayer.id.startsWith("Results_")) {
      tLayer = tLayer.sublayers.find(function (sublayer) {
        return sublayer.id === 0;
      });
    } else if (tLayer.type == "feature") {
      //
    } else {
      return;
    }

    tLayer.queryFeatures(query).then(function (graphics) {
      let result = graphics.features[0];

      if (
        !(
          result.geometry.spatialReference.isWGS84 ||
          result.geometry.spatialReference.isWebMercator ||
          result.geometry.spatialReference.isGeographic
        )
      ) {
        if (_webMercatorUtils.canProject(result.geometry, map)) {
          result.geometry = _webMercatorUtils.project(result.geometry, map);
        } else {
          return;
        }
      }
      view
        .goTo(result.geometry.extent.expand(3))
        .then(function () {
          view.popup.open({
            features: [result],
            location: result.geometry.centroid,
          });
        })
        .catch(function (error) {
          if (error.name != "AbortError") {
            console.error(error);
          }
        });
    });
  }
}

/* Swipe */

function viewSwipe() {
  if (
    $("#selectSwipe_Derecha").val() != -1 &&
    $("#selectSwipe_Izquierda").val() != -1 &&
    $("#selectSwipe_Derecha").val() != $("#selectSwipe_Izquierda").val()
  ) {
    let nameLayerDerecha = $("#selectSwipe_Derecha").val();
    let nameLayerIzquierda = $("#selectSwipe_Izquierda").val();

    const tLayerDerecha = map.findLayerById(nameLayerDerecha);
    const tLayerIzquierda = map.findLayerById(nameLayerIzquierda);

    tLayerDerecha.visible = true;
    tLayerIzquierda.visible = true;

    // Si el swipe existe lo destruye
    if (swipeMapa != undefined && !swipeMapa.destroyed) {
      swipeMapa.destroy();
    }

    // Crea el swipe
    swipeMapa = new _Swipe({
      view: view,
      position: 50,
      leadingLayers: [tLayerIzquierda],
      trailingLayers: [tLayerDerecha],
    });

    // Agrega el swipe a la vista
    view.ui.add(swipeMapa);

    // Borra los textos
    $("#layer_Izquierda").html(tLayerIzquierda.title);
    $("#layer_Derecha").html(tLayerDerecha.title);

    $("#layer_Izquierda").show();
    $("#layer_Derecha").show();

    // Deshabilita los selectores
    $("#selectSwipe_Derecha").prop("disabled", true);
    $("#selectSwipe_Izquierda").prop("disabled", true);

    $("#selectSwipe_Derecha").hide();
    $("#selectSwipe_Izquierda").hide();

    current_reportes = arrayRemove(current_reportes, "swipe");
    reporteUso("swipe", tLayerIzquierda.id, "izquierda");
    reporteUso("swipe", tLayerDerecha.id, "derecha");
  } else {
    alerta(
      "Se deben seleccionar dos layers diferentes para realizar la comparación"
    );
  }
}

function removeSwipe() {
  if (swipeMapa != undefined && !swipeMapa.destroyed) {
    swipeMapa.destroy();
  }

  // Borra los textos
  $("#layer_Izquierda").html("");
  $("#layer_Derecha").html("");

  $("#layer_Izquierda").hide();
  $("#layer_Derecha").hide();

  // Habilita los selectores
  $("#selectSwipe_Derecha").prop("disabled", false);
  $("#selectSwipe_Izquierda").prop("disabled", false);

  $("#selectSwipe_Derecha").val("-1");
  $("#selectSwipe_Izquierda").val("-1");

  $("#selectSwipe_Derecha").show();
  $("#selectSwipe_Izquierda").show();
}

function addOptionSwipe(tLayer) {
  $("#selectSwipe_Derecha").append(
    $("<option>", {
      value: tLayer.id,
      text: tLayer.title,
    })
  );
  $("#selectSwipe_Izquierda").append(
    $("<option>", {
      value: tLayer.id,
      text: tLayer.title,
    })
  );
}

function removeOptionSwipe(tLayer) {
  $("#selectSwipe_Derecha option[value=" + tLayer.id + "]").remove();
  $("#selectSwipe_Izquierda option[value=" + tLayer.id + "]").remove();

  if (swipeMapa != undefined && !swipeMapa.destroyed) {
    let izqLayers = swipeMapa.leadingLayers.items;
    let derLayers = swipeMapa.trailingLayers.items;

    for (let layer of izqLayers) {
      if (layer.id == tLayer.id) {
        removeSwipe();
        return;
      }
    }

    for (let layer of derLayers) {
      if (layer.id == tLayer.id) {
        removeSwipe();
        return;
      }
    }
  }
}

function activeFirstLegend() {
  let cardsLegend = document.getElementsByClassName(
    "esri-legend--card__carousel-indicator"
  );

  for (const card of cardsLegend) {
    if (card.title.startsWith("1 ")) {
      card.click();
    }
  }
}

/* Agregar servicios web geograficos */

function gotoAgregar() {
  if ($("#servicesList").html() == "") {
    let currentCategoria = null;
    let currentCategoriaCount = 0;
    let currentSubCategoria = null;
    let currentSubCategoriaCount = 0;

    for (const layer of config_layers) {
      if (currentCategoria != layer.ID_CATEGORIA) {
        if (currentCategoria != null) {
          $(
            "[data-categoria-group='" + currentCategoria + "'] > div > a > span"
          ).html("&nbsp;(" + (currentCategoriaCount + 1) + ")");
        }
        currentCategoria = layer.ID_CATEGORIA;
        currentCategoriaCount = 0;
        let strCatHTML = "";
        strCatHTML =
          strCatHTML +
          "<li data-categoria-group='" +
          layer.ID_CATEGORIA +
          "' class='list-group-item activec'>";
        strCatHTML = strCatHTML + "<div class='media-left'>";
        strCatHTML =
          strCatHTML +
          "<a href='#' class='linkVGV' style='font-weight: bold;' onclick='showCategory(" +
          layer.ID_CATEGORIA +
          ");'></a>";
        strCatHTML = strCatHTML + "</div>";
        strCatHTML =
          strCatHTML +
          "<div class='media-body' style='vertical-align: middle;'>";
        strCatHTML =
          strCatHTML +
          "<a href='#' class='linkVGV' style='font-weight: bold;' onclick='showCategory(" +
          layer.ID_CATEGORIA +
          ");'>" +
          layer.CATEGORIA +
          "<span>&nbsp;</span></a>";
        strCatHTML = strCatHTML + "</div>";
        strCatHTML = strCatHTML + "</li>";
        $("#servicesList").append(strCatHTML);
      } else {
        currentCategoriaCount = currentCategoriaCount + 1;
      }
      if (layer.ID_SUBCATEGORIA != undefined || layer.ID_SUBCATEGORIA != null) {
        if (currentSubCategoria != layer.ID_SUBCATEGORIA) {
          if (currentSubCategoria != null) {
            $(
              "[data-subcategoria-group='" +
                currentSubCategoria +
                "'] > div > a > span"
            ).html("&nbsp;(" + (currentSubCategoriaCount + 1) + ")");
          }
          currentSubCategoria = layer.ID_SUBCATEGORIA;
          currentSubCategoriaCount = 0;
          let strSubCatHTML = "";
          strSubCatHTML =
            strSubCatHTML +
            "<li  data-categoria='" +
            layer.ID_CATEGORIA +
            "' data-subcategoria-group='" +
            layer.ID_SUBCATEGORIA +
            "' class='list-group-item' style='display: none;'>";
          strSubCatHTML =
            strSubCatHTML +
            "<div class='media-body' style='vertical-align: middle;'>";
          strSubCatHTML =
            strSubCatHTML +
            "<a href='#' class='linkVGV' style='font-weight: bold;' onclick='showSubCategory(" +
            layer.ID_CATEGORIA +
            "," +
            layer.ID_SUBCATEGORIA +
            ");'>" +
            layer.SUBCATEGORIA +
            "<span>&nbsp;</span></a>";
          strSubCatHTML = strSubCatHTML + "</div>";
          strSubCatHTML = strSubCatHTML + "<div class='media-right'>";
          strSubCatHTML =
            strSubCatHTML +
            "<button type='button' style='width: 32px;height: 25px;' data-toggle='tooltip' data-placement='bottom' title='Expandir subcategoria' class='btn btn-xs btn-default' onclick='showSubCategory(" +
            layer.ID_CATEGORIA +
            "," +
            layer.ID_SUBCATEGORIA +
            ");'>";
          strSubCatHTML =
            strSubCatHTML +
            "<span class='esri-icon-down' style='padding-top: 5px;'></span>";
          strSubCatHTML = strSubCatHTML + "</button>";
          strSubCatHTML = strSubCatHTML + "</div>";
          strSubCatHTML = strSubCatHTML + "</li>";
          $("#servicesList").append(strSubCatHTML);
        } else {
          currentSubCategoriaCount = currentSubCategoriaCount + 1;
        }
        if (currentSubCategoria != null) {
          $(
            "[data-subcategoria-group='" +
              currentSubCategoria +
              "'] > div > a > span"
          ).html("&nbsp;(" + (currentSubCategoriaCount + 1) + ")");
        }
      } else {
        currentSubCategoria = null;
        currentSubCategoriaCount = 0;
      }

      let strHTMLSubCategoria =
        currentSubCategoria == null
          ? ""
          : "' data-subcategoria='" + layer.ID_SUBCATEGORIA;
      let strHTML =
        "<li data-layer='" +
        layer.ID_SERVICIO +
        "' data-categoria='" +
        layer.ID_CATEGORIA +
        strHTMLSubCategoria +
        "' class='list-group-item' style='display: none;'>";

      strHTML = strHTML + "<div class='media-body' style='font-size: small;'>";
      strHTML =
        strHTML +
        "<a href='#' class='media-heading' style='font-size: small;color: black;' onclick='showDetail(" +
        layer.ID_SERVICIO +
        ");'>" +
        layer.NOMBRE +
        "</a>";

      if (layer.ID_SUBCATEGORIA) {
        strHTML =
          strHTML +
          "<div id='extra-data-" +
          layer.ID_SERVICIO +
          "' class='extra-data collapse' style='margin-left: 5px;'>";
      } else {
        strHTML =
          strHTML +
          "<div id='extra-data-" +
          layer.ID_SERVICIO +
          "' class='extra-data collapse'>";
      }

      if (layer.RESUMEN) {
        strHTML = strHTML + "<p style='margin: 0px'>" + layer.RESUMEN + "</p>";
      }
      if (layer.ENTIDAD) {
        strHTML =
          strHTML +
          "<p style='margin: 0px'><b>Entidad:</b> " +
          layer.ENTIDAD +
          "</p>";
      }
      if (layer.FECHA) {
        strHTML =
          strHTML +
          "<p style='margin: 0px'><b>Fecha de actualizaci&oacute;n:</b> " +
          layer.FECHA +
          "</p>";
      }
      if (layer.LICENCIA) {
        strHTML =
          strHTML +
          "<p style='margin: 0px'><b>Licencia:</b> " +
          layer.LICENCIA +
          "</p>";
      }
      if (layer.URL2) {
        let URLShow = layer.URL2;
        let n = URLShow.lastIndexOf("/");
        n = URLShow.lastIndexOf("/", n - 1);
        n = URLShow.lastIndexOf("/", n - 1);
        n = URLShow.lastIndexOf("/", n - 1);

        strHTML =
          strHTML +
          "<p style='margin: 0px'><b>URL: </b><a class='linkVGV' href='" +
          URLShow +
          "' target='_blank' rel='noopener'>" +
          URLShow +
          "</a></p>";
      } else {
        let URLShow = layer.URL;
        let n = URLShow.lastIndexOf("/");
        n = URLShow.lastIndexOf("/", n - 1);
        n = URLShow.lastIndexOf("/", n - 1);
        n = URLShow.lastIndexOf("/", n - 1);

        strHTML =
          strHTML +
          "<p style='margin: 0px'><b>URL: </b><a class='linkVGV' href='" +
          URLShow +
          "' target='_blank' rel='noopener'>" +
          URLShow +
          "</a></p>";
      }
      if (layer.URL4) {
        strHTML =
          strHTML +
          "<a href='#' onclick='openMetadataURL(\"" +
          layer.URL4 +
          "\");'>M&aacute;s informaci&oacute;n</a>";
      } else if (layer.ID_METADATO) {
        strHTML =
          strHTML +
          "<a href='#' onclick='openMetadata(\"" +
          layer.ID_METADATO +
          "\");'>M&aacute;s informaci&oacute;n</a>";
      }

      strHTML = strHTML + "</div>";
      strHTML = strHTML + "</div>";
      strHTML = strHTML + "<div class='media-right'>";
      strHTML =
        strHTML +
        "<button data-layer='" +
        layer.ID_SERVICIO +
        "-Btn' type='button' data-toggle='tooltip' data-placement='bottom' title='Agregar al mapa' class='btn btn-xs btn-default' onclick='showLayer(\"" +
        layer.ID_SERVICIO +
        "\");'>";
      strHTML =
        strHTML +
        "<span class='esri-icon-plus linkVGV' style='padding-top: 5px;'></span>";
      strHTML = strHTML + "</button>";
      strHTML = strHTML + "</div>";

      strHTML = strHTML + "</li>";
      $("#servicesList").append(strHTML);
    }
    if (currentCategoria) {
      $(
        "[data-categoria-group='" + currentCategoria + "'] > div > a > span"
      ).html("&nbsp;(" + (currentCategoriaCount + 1) + ")");
    }
  }
}

function showCategory(id) {
  if ($("#servicesList > [data-categoria='" + id + "']:visible").length > 0) {
    $("#servicesList > [data-categoria='" + id + "']").hide();
  } else {
    $("#servicesList > :not(.activec)").hide();
    $("#servicesList > [data-categoria='" + id + "']").show();
    if (
      $(
        "#servicesList > [data-categoria='" + id + "']:not([data-subcategoria])"
      ).length
    ) {
      $(
        "#servicesList > [data-categoria='" + id + "'][data-subcategoria]"
      ).hide();
    }
  }
}

function showSubCategory(idCategoria, idSubCategoria) {
  if (
    $("#servicesList > [data-subcategoria='" + idSubCategoria + "']:visible")
      .length > 0
  ) {
    $("#servicesList > [data-subcategoria='" + idSubCategoria + "']").hide();
  } else {
    $("#servicesList > :not(.activec)").hide();
    $(
      "#servicesList > [data-categoria='" +
        idCategoria +
        "']:not([data-subcategoria])"
    ).show();
    $("#servicesList > [data-subcategoria='" + idSubCategoria + "']").show();
  }
}

function showLayer(id) {
  $("[data-layer='" + id + "']").addClass("disabled");
  $("[data-layer='" + id + "-Btn']").hide();
  for (let i = 0; i < config_layers.length; i++) {
    if (id == config_layers[i].ID_SERVICIO) {
      showLayerId(i);
      break;
    }
  }
}

function showLayerId(i) {
  if (config_layers[i].TIPO == "FeatureLayer") {
    let tLayer = new _FeatureLayer({
      url: config_layers[i].URL,
      title: config_layers[i].NOMBRE,
      id: config_layers[i].ID_SERVICIO,
      outFields: ["*"],
      visible: true,
      legendEnabled: true,
    });
    tLayer.when(function () {
      reportLoad(tLayer.id);
      $("#panelLoadLayers").removeClass("in");

      addOptionSwipe(tLayer);

      let ext = tLayer.fullExtent;
      let cloneExt = ext.clone();
      view
        .goTo({
          target: tLayer.fullExtent,
          extent: cloneExt.expand(1.25),
        })
        .then(function () {
          if (!LegendExpand.expanded) {
            LegendExpand.expand();
          }
        });
    });
    map.add(tLayer);
    current_layers.push(tLayer.id);
  } else if (config_layers[i].TIPO == "MapServer") {
    let tLayer;
    if (config_layers[i].SUBLAYER) {
      tLayer = new _MapImageLayer({
        url:
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
        sublayers: [
          {
            id: config_layers[i].SUBLAYER,
            visible: true,
          },
        ],
        title: config_layers[i].NOMBRE,
        id: config_layers[i].ID_SERVICIO,
      });
    } else {
      tLayer = new _MapImageLayer({
        url: config_layers[i].URL,
        title: config_layers[i].NOMBRE,
        id: config_layers[i].ID_SERVICIO,
      });
    }

    tLayer.when(function () {
      reportLoad(this.id);
      $("#panelLoadLayers").removeClass("in");

      let ext = tLayer.fullExtent;
      let cloneExt = ext.clone();
      view
        .goTo({
          target: tLayer.fullExtent,
          extent: cloneExt.expand(1.25),
        })
        .then(function () {
          if (!LegendExpand.expanded) {
            LegendExpand.expand();
          }
        });
    });
    map.add(tLayer);
    current_layers.push(tLayer.id);
  }
}

function showDetail(id) {
  $(".extra-data").addClass("collapse");
  $("#extra-data-" + id).toggleClass("collapse");
}

function hideLayer(id) {
  $("[data-layer='" + id + "']").removeClass("disabled");
  $("[data-layer='" + id + "-Btn']").show();
  $("[data-layer-map='" + id + "']").remove();
  $("#selectServiceTable option")
    .filter("[value='" + id + "']")
    .remove();
  $("#selectCommentService option")
    .filter("[value='" + id + "']")
    .remove();

  current_layers = current_layers.filter(function (item) {
    return item !== id;
  });
}

function reportLoad(id) {
  for (let layer of config_layers) {
    if (id == layer.ID_SERVICIO) {
      if (layer.ES_SERVICIO_PROPIO == null) {
        current_reportes = arrayRemove(current_reportes, "servicios");
        reporteUso("servicios", id, "load");
      }
      break;
    }
  }
}

/* CSV */

function uploadCSV(evt) {
  let Campo1Req = "";
  let Campo2Req = "VGV_NVALOR";

  let filtroGeografico = $("#settingsTipoCSV").val();
  if (filtroGeografico == "csvDepartamento") {
    Campo1Req = "DPTO_NCDGO";
  } else if (filtroGeografico == "csvMunicipal") {
    Campo1Req = "MPIO_NCDGO";
  } else if (filtroGeografico == "csvDT") {
    Campo1Req = "DT_NCDGO";
  } else if (filtroGeografico == "csvPDET") {
    Campo1Req = "PDET_NCDGO";
  }

  var file = evt.target.files[0];
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (event) {
    var csvData = event.target.result;

    dataLoadCSV = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (
      dataLoadCSV.meta.fields.indexOf(Campo1Req) == -1 ||
      dataLoadCSV.meta.fields.indexOf(Campo2Req) == -1
    ) {
      alerta(
        "El archivo  " +
          file.fileName +
          " no tiene los campos esperados según el modelo disponible"
      );
      dataLoadCSV = null;
      current_reportes = arrayRemove(current_reportes, "CSV");
      reporteUso("CSV", filtroGeografico, "load");
    } else {
      current_reportes = arrayRemove(current_reportes, "CSV");
      reporteUso("CSV", filtroGeografico, "error");
    }
  };
  reader.onerror = function () {
    current_reportes = arrayRemove(current_reportes, "CSV");
    reporteUso("CSV", filtroGeografico, "error");
    alerta("No fue posible leer el archivo " + file.fileName);
  };
}

function loadFileCSV() {
  let settingsTitleCSV = $("#settingsTitleCSV").val();
  let settingsVariableCSV = $("#settingsVariableCSV").val();

  if (
    settingsTitleCSV == undefined ||
    settingsTitleCSV == null ||
    settingsTitleCSV == ""
  ) {
    alerta("Se debe indicar el nombre del mapa a crear");
    return;
  }

  if (
    settingsVariableCSV == undefined ||
    settingsVariableCSV == null ||
    settingsVariableCSV == ""
  ) {
    alerta("Se debe indicar el nombre de la variable a mapear");
    return;
  }

  if (dataLoadCSV == null) {
    alerta("Se debe adjuntar un archivo CSV");
    return;
  }

  loading = $.dialog({
    title: "",
    content: "",
    onContentReady: function () {
      this.showLoading(false);
    },
  });

  // Recupera el tipo de CSV a procesar
  let filtroGeografico = $("#settingsTipoCSV").val();
  let parametros;
  if (filtroGeografico == "csvDepartamento") {
    // parametros de visualización
    parametros = {
      tLayerBase: nameLayerDepartamentos,
      nivelGeografico: "Departamento",
      campoGeografico: "DPTO_NCDGO",
      nombreGeografico: "DPTO_CNMBR",
      adjNombreGeografico: null,
    };
  } else if (filtroGeografico == "csvMunicipal") {
    // parametros de visualización
    parametros = {
      tLayerBase: nameLayerMunicipios,
      nivelGeografico: "Municipio",
      campoGeografico: "MPIO_NCDGO",
      nombreGeografico: "MPIO_CNMBR",
      adjNombreGeografico: "DPTO_CNMBR",
    };
  } else if (filtroGeografico == "csvDT") {
    // parametros de visualización
    parametros = {
      tLayerBase: nameLayerDT,
      nivelGeografico: "Dirección Territorial",
      campoGeografico: "DT_NCDGO",
      nombreGeografico: "DT_CNMBR",
      adjNombreGeografico: null,
    };
  } else if (filtroGeografico == "csvPDET") {
    // parametros de visualización
    parametros = {
      tLayerBase: nameLayerPDET,
      nivelGeografico: "PDET",
      campoGeografico: "PDET_NCDGO",
      nombreGeografico: "PDET_CNMBR",
      adjNombreGeografico: null,
    };
  } else {
    alerta("Debe seleccionar un tipo de selección espacial");
  }

  // Obtención de los datos finales
  if (map.findLayerById(parametros.tLayerBase) == undefined) {
    loadBaseGeografica(parametros.tLayerBase);
    let tLayer = map.findLayerById(parametros.tLayerBase);
    tLayer.when(function () {
      asignarCSVGeografico(dataLoadCSV.data, parametros);
    });
  } else {
    asignarCSVGeografico(dataLoadCSV.data, parametros);
  }

  if (loading.isOpen()) {
    loading.close();
  }
}

function asignarCSVGeografico(lstDatosCSV, lstParametros) {
  if (lstDatosCSV.length > 0) {
    let settingsTitleCSV =
      $("#settingsTitleCSV").val() + " - Datos cargados por el usuario";
    let settingsVariableCSV = $("#settingsVariableCSV").val();

    const tLayer = map.findLayerById(lstParametros.tLayerBase);

    removeLayer(settingsTitleCSV);

    let query = tLayer.createQuery();
    query.where = "1=1";

    tLayer.queryFeatures(query).then(function (results) {
      for (let indexGeo = 0; indexGeo < results.features.length; indexGeo++) {
        results.features[indexGeo].attributes.OBJECTID = indexGeo;
        results.features[indexGeo].attributes.VGV_NVALOR = null;
        for (let datoCSV of lstDatosCSV) {
          if (
            parseInt(datoCSV[lstParametros.campoGeografico]) ==
            parseInt(
              results.features[indexGeo].attributes[
                lstParametros.campoGeografico
              ]
            )
          ) {
            results.features[indexGeo].attributes.VGV_NVALOR = parseFloat(
              datoCSV.VGV_NVALOR
            );
            break;
          }
        }
      }

      for (
        let indexGeo = results.features.length - 1;
        indexGeo >= 0;
        indexGeo--
      ) {
        if (results.features[indexGeo].attributes.VGV_NVALOR == null) {
          results.features.splice(indexGeo, 1);
        }
      }

      let varContent = "";
      if (lstParametros.adjNombreGeografico != null) {
        varContent = `En el ${lstParametros.nivelGeografico} de <b>{${lstParametros.nombreGeografico}} ({${lstParametros.adjNombreGeografico}})</b>, se presentaron <b>{VGV_NVALOR} ${settingsVariableCSV}</b> `;
      } else {
        varContent = `En el ${lstParametros.nivelGeografico} de <b>{${lstParametros.nombreGeografico}}</b>, se presentaron <b>{VGV_NVALOR} ${settingsVariableCSV}</b>.`;
      }

      const layerResults = new _FeatureLayer({
        source: results.features,
        fields: tLayer.fields,
        objectIdField: "OBJECTID",
        opacity: 0.8,
        title: settingsTitleCSV,
        id: settingsTitleCSV,
        popupTemplate: {
          title: "<b>" + settingsVariableCSV + "</b>",
          content: varContent,
          fieldInfos: [
            {
              fieldName: "VGV_NVALOR",
              format: {
                digitSeparator: true,
                places: 0,
              },
            },
          ],
        },
        copyright: "Unidad para las Víctimas",
        visible: true,
        legendEnabled: true,
        listMode: "show",
        layerOrigen: tLayer.id.split("_")[1],
        variableOrigen: capitalizeFirstLetter(settingsVariableCSV),
      });

      createRendererCSV(layerResults);
      map.add(layerResults);

      layerResults.when(function () {
        current_reportes = arrayRemove(current_reportes, "CSV");
        reporteUso(
          "CSV",
          layerResults.layerOrigen + " - " + layerResults.variableOrigen,
          "complete"
        );

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
        clearFileCSV();
        $("#panelLoadCSV").removeClass("in");
      });

      const tLayerLabels = map.findLayerById(tLayerBaseLabelsId);
      map.reorder(tLayerLabels, map.layers.items.length);
      tLayerLabels.visible = true;
    });
  }
}

function clearFileCSV() {
  $("#settingsFileCSV").val("");
  $("#settingsTitleCSV").val("");
  $("#settingsVariableCSV").val("");
}

function createRendererCSV(tLayer) {
  let classificationMethod = $("#class-select-CSV").val();
  let numClasses = parseInt($("#num-classes-CSV").val());
  let color_1 = $("#styleRampColor1-CSV").val();
  let color_2 = $("#styleRampColor2-CSV").val();
  let color_3 = $("#styleRampColor3-CSV").val();
  const schemesCSV = getScheme(color_1, color_2, color_3);

  const params = {
    layer: tLayer,
    field: "VGV_NVALOR",
    view: view,
    classificationMethod: classificationMethod,
    numClasses: numClasses,
    colorScheme: schemesCSV,
  };

  _colorRendererCreator
    .createClassBreaksRenderer(params)
    .then(function (rendererResponse) {
      rendererResponse.renderer.defaultLabel = "Sin Datos";
      rendererResponse.renderer.defaultSymbol.color.a = 0.7;
      tLayer.renderer = rendererResponse.renderer;

      const tLayerLabels = map.findLayerById(tLayerBaseLabelsId);
      map.reorder(tLayerLabels, map.layers.items.length);
      tLayerLabels.visible = true;

      if (loading.isOpen()) {
        loading.close();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

/* Imprimir */

function imprimirMapa() {
  reporteUso("print", "", "load");

  loading = $.dialog({
    title: "",
    content: "",
    onContentReady: function () {
      this.showLoading(false);
    },
  });

  let tituloMapa = $("#tituloImpresion").val();
  tituloMapa =
    tituloMapa == undefined || tituloMapa == "" ? "SinTitulo" : tituloMapa;

  let scaleImpresion = $("#escalaImpresion").val();
  scaleImpresion = replaceAll(scaleImpresion, ",", "");
  scaleImpresion = parseInt(scaleImpresion) || parseInt(view.scale);

  let fechaCorteString = FechaCorte.split(",")[1];
  fechaCorteString = fechaCorteString.trim();
  fechaCorteString = "Corte: " + fechaCorteString;

  var template = new _PrintTemplate({
    format: $("#formatoImpresion").val(),
    exportOptions: {
      width: $(window).width(),
      height: $(window).height(),
      dpi: $("#dpiImpresion").val(),
    },
    layout: $("#plantillaImpresion").val(),
    layoutOptions: {
      titleText: tituloMapa,
      authorText: "UARIV",
      scalebarUnit: "Kilometers",
      customTextElements: [
        {
          FechaCorte: fechaCorteString,
        },
      ],
    },
    outScale: scaleImpresion,
    scalePreserved: true,
  });

  var params = new _PrintParameters({
    view: view,
    template: template,
  });

  printTask.execute(params).then(
    function (printResult) {
      $("#listImpresion").append(
        '<a href="' +
          printResult.url +
          '" target="_blank" class="list-group-item linkVGV no-border" style="padding: 5px !important;"><span class="esri-icon-download" aria-hidden="true"></span><span class="panel-label" style="font-size: x-small;">' +
          tituloMapa +
          "_" +
          $("#plantillaImpresion").val() +
          "." +
          $("#formatoImpresion").val() +
          "</span></a>"
      );
      console.log(printResult);
      reporteUso("print", "", "print-complete");
      if (loading.isOpen()) {
        loading.close();
      }
    },
    function (printError) {
      if (loading.isOpen()) {
        loading.close();
      }
      console.log(printError);
      reporteUso("print", "", "print-error");
      alerta("El mapa no pudo ser generado");
    }
  );
}

/* Utilidades */

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

function reporteUso(caracteristica, labelEvento, accionEvento) {
  labelEvento =
    typeof labelEvento !== "undefined" &&
    labelEvento !== null &&
    labelEvento !== ""
      ? labelEvento
      : "uso";
  accionEvento =
    typeof accionEvento !== "undefined" &&
    accionEvento !== null &&
    accionEvento !== ""
      ? accionEvento
      : "uso";
  if (current_reportes.indexOf(caracteristica) == -1) {
    current_reportes.push(caracteristica);
    gtag("event", caracteristica, {
      send_to: "UA-100690200-1",
      event_category: caracteristica,
      event_action: accionEvento,
      event_label: labelEvento,
    });
  }
}

function splitDataUncompress(data) {
  let b64Data = data.vgvData;
  let strData = atob(b64Data);
  let charData = strData.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  let binData = new Uint8Array(charData);
  let dataPako = pako.inflate(binData);

  let strDataPako = "";
  let initDataPako = 0;

  while (initDataPako < dataPako.length) {
    try {
      let sliceDataPako = dataPako.slice(
        initDataPako,
        initDataPako + avancePako
      );
      let charDataPako = String.fromCharCode.apply(
        null,
        new Uint16Array(sliceDataPako)
      );
      strDataPako = strDataPako + charDataPako;
      initDataPako += avancePako;
    } catch (error) {
      avancePako = 65000;
      let sliceDataPako = dataPako.slice(
        initDataPako,
        initDataPako + avancePako
      );
      let charDataFault = String.fromCharCode.apply(
        null,
        new Uint16Array(sliceDataPako)
      );
      strDataPako = strDataPako + charDataFault;
      initDataPako += avancePako;
    }
  }

  return JSON.parse(strDataPako);
}

function buildSelectSingle(domSelect, arrayDatos) {
  $("#" + domSelect).hide();

  let strHTML = '<select id="' + domSelect + '">';
  for (let index = arrayDatos.length - 1; index >= 0; index--) {
    strHTML +=
      "<option value='" +
      arrayDatos[index] +
      "'>" +
      arrayDatos[index] +
      "</option>";
  }
  strHTML += "</select>";

  $("#" + domSelect).html(strHTML);
  $("#" + domSelect).show();
}

function buildSelectImpresion(domSelect, arrayDatos) {
  $("#" + domSelect).hide();

  let strHTML = '<select id="' + domSelect + '">';
  for (let value of arrayDatos) {
    strHTML +=
      "<option value='" + value.nombre + "'>" + value.titulo + "</option>";
  }
  strHTML += "</select>";

  $("#" + domSelect).html(strHTML);
  $("#" + domSelect).show();
}

function buildSelectMultiple(objSelect) {
  $("#" + objSelect.domElement).multiselect("destroy");
  $("#" + objSelect.domElement).hide();

  let strHTML =
    '<select id="' +
    objSelect.domElement +
    '" multiple="multiple" data-placeholder="' +
    objSelect.defaultText +
    '">';
  strHTML += '<optgroup label="' + objSelect.defaultText + '">';
  for (let element of objSelect.valueList) {
    if (objSelect.descList == objSelect.codeList) {
      strHTML +=
        "<option value='" +
        element +
        "' selected='selected'>" +
        element +
        "</option>";
    } else if (objSelect.subText != null) {
      strHTML +=
        "<option value='" +
        element[objSelect.codeList] +
        "' selected='selected'>" +
        element[objSelect.subText] +
        " - " +
        element[objSelect.descList] +
        "</option>";
    } else if (objSelect.subText == null) {
      strHTML +=
        "<option value='" +
        element[objSelect.codeList] +
        "' selected='selected'>" +
        element[objSelect.descList] +
        "</option>";
    }
  }
  strHTML += "</optgroup>";
  strHTML += "</select>";

  $("#" + objSelect.domElement).html(strHTML);
  $("#" + objSelect.domElement).multiselect({
    buttonWidth: $("#selectFiltro_Geografico").css("width"),
    enableClickableOptGroups: true,
    enableCollapsibleOptGroups: true,
    collapseOptGroupsByDefault: true,
    maxHeight: 300,
    // dropUp: true,
    enableFiltering: true,
    filterPlaceholder: "Filtrar...",
    enableCaseInsensitiveFiltering: true,
    allSelectedText: objSelect.defaultText + "...",
    checkboxName: function (_option) {
      return "multiselect[]";
    },
    onChange: function (options, checked) {
      let _this = this;
      getOptionsSelected(_this);
    },
  });

  // Ajusta los anchos de los select multiples
  // $("ul.multiselect-container > li").css("width", $("#selectFiltro_Geografico").width() + 30);
  $("#" + objSelect.domElement).show();
}

function getOptionsSelected(selectData) {
  let $selectId = selectData.$select[0].id;
  let $lenSelectAll = selectData.originalOptions.length;
  let $lenSelect = selectData.$select[0].selectedOptions.length;
  let $selectOptions = selectData.$select[0].selectedOptions;

  let filtroGeografico = $("#selectFiltro_Geografico").val();

  if (filtroGeografico == "filtroMunicipal") {
    if ($selectId == "selectFiltro_Departamento") {
      if ($lenSelectAll == $lenSelect) {
        $("#selectFiltro_Municipios").multiselect("selectAll", false);
        $("#selectFiltro_Municipios").multiselect("updateButtonText");
      } else if ($lenSelect == 0) {
        $("#selectFiltro_Municipios").multiselect("deselectAll", false);
        $("#selectFiltro_Municipios").multiselect("updateButtonText");
      } else {
        $("#selectFiltro_Municipios").multiselect("deselectAll", false);
        $("#selectFiltro_Municipios").multiselect("updateButtonText");
        let municipiosSelected = [];
        for (let valueDpto of $selectOptions) {
          let nombreDepartamento = valueDpto.text + " - ";
          const optionsMunicipios = $("#selectFiltro_Municipios")[0].options;
          for (let valueMpio of optionsMunicipios) {
            if (valueMpio.text.startsWith(nombreDepartamento)) {
              municipiosSelected.push(valueMpio.value);
            }
          }
        }
        $("#selectFiltro_Municipios").multiselect("select", municipiosSelected);
      }
    } else if ($selectId == "selectFiltro_Municipios") {
      if ($lenSelectAll == $lenSelect) {
        $("#selectFiltro_Departamento").multiselect("selectAll", false);
        $("#selectFiltro_Departamento").multiselect("updateButtonText");
      } else if ($lenSelect == 0) {
        $("#selectFiltro_Departamento").multiselect("deselectAll", false);
        $("#selectFiltro_Departamento").multiselect("updateButtonText");
      }
    }
  } else if (
    filtroGeografico == "filtroDepartamento" ||
    filtroGeografico == "filtroDT" ||
    filtroGeografico == "filtroPDET"
  ) {
    // Valida
  } else {
    alerta("Debe seleccionar un tipo de selección espacial");
  }
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    if (a[property] < b[property]) {
      return -1 * sortOrder;
    } else if (a[property] > b[property]) {
      return sortOrder;
    } else {
      return 0;
    }
  };
}

function dynamicSortMultiple() {
  /*
   * save the arguments object as it will be overwritten
   * note that arguments object is an array-like object
   * consisting of the names of the properties to sort by
   */
  var props = arguments;
  return function (obj1, obj2) {
    var i = 0,
      result = 0,
      numberOfProperties = props.length;
    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  };
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function getDateText(date) {
  if (typeof date == "string" || date instanceof String) {
    date = parseInt(date);
  }

  let d = new Date(date);
  return (
    d.getFullYear() +
    "/" +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + d.getDate()).slice(-2)
  );
}

function alerta(text) {
  $.alert({
    title: "",
    content: text,
  });
}

function jsonCopy(src) {
  return JSON.parse(JSON.stringify(src));
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function irTabPanel(strPanel) {
  $("a[href='#" + strPanel + "']")[0].click();
}

function getScheme(color_1, color_2, color_3) {
  let numClasses = 11;
  let noDataColor = "#cccccc";
  let colorsForClassBreaks = [];

  colorsForClassBreaks.push({
    colors: [new _Color(color_3)],
    numClasses: 1,
  });
  colorsForClassBreaks.push({
    colors: [new _Color(color_1), new _Color(color_3)],
    numClasses: 2,
  });
  colorsForClassBreaks.push({
    colors: [new _Color(color_1), new _Color(color_2), new _Color(color_3)],
    numClasses: 3,
  });

  for (let numClass = 4; numClass <= numClasses; numClass++) {
    let colorsArray = [];

    let rainbow = new Rainbow();
    rainbow.setNumberRange(1, numClass);
    rainbow.setSpectrum(color_1, color_2, color_3);
    for (let i = 1; i <= numClass; i++) {
      let hexColour = rainbow.colourAt(i);
      colorsArray.push(new _Color("#" + hexColour));
    }
    colorsForClassBreaks.push({
      colors: colorsArray,
      numClasses: numClass,
    });
  }

  return {
    id: "rampColorVGV",
    colors: [new _Color(color_1), new _Color(color_2), new _Color(color_3)],
    noDataColor: new _Color(noDataColor),
    colorsForClassBreaks: colorsForClassBreaks,
    outline: {
      color: {
        r: 153,
        g: 153,
        b: 153,
        a: 0.25,
      },
      width: "0.25px",
    },
    opacity: 0.8,
  };
}

function ajustarRampVGV() {
  let color_1 = $("#styleRampColor1-VGV").val();
  let color_2 = $("#styleRampColor2-VGV").val();
  let color_3 = $("#styleRampColor3-VGV").val();

  $("#styleColorRamp-VGV").css(
    "background",
    "linear-gradient(to right, " +
      color_1 +
      " 20%, " +
      color_2 +
      " 50%, " +
      color_3 +
      " 80%)"
  );
}

function ajustarRampCSV() {
  let color_1 = $("#styleRampColor1-CSV").val();
  let color_2 = $("#styleRampColor2-CSV").val();
  let color_3 = $("#styleRampColor3-CSV").val();

  $("#styleColorRamp-CSV").css(
    "background",
    "linear-gradient(to right, " +
      color_1 +
      " 20%, " +
      color_2 +
      " 50%, " +
      color_3 +
      " 80%)"
  );
}

function removeLayer(tLayer) {
  if (map.findLayerById(tLayer)) {
    map.remove(map.findLayerById(tLayer));
  }
}
