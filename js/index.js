// "use strict";

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

  $("#class-select").on("change", function () {
    changeParametersScheme();
  });

  $("#num-classes").on("change", function () {
    $("#label-num-classes").text(
      "Número de clases (" + $("#num-classes").val() + ")"
    );
    changeParametersScheme();
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
    if ($("#settingsTipoChart").val() == "heatmap") {
      $("#labelParametro2Chart").show();
      $("#settingsParametro2Chart").show();
    } else {
      $("#labelParametro2Chart").hide();
      $("#settingsParametro2Chart").hide();
    }
    generateVisualChart();
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
      for (let i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  });
  updateSize();

  // Inicializar mapa
  if (window.innerWidth <= 500) {
    zoomInicial = 4;
    centerInicial = [-73, 4.5];
  }
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

function InitMap2() {
  // Config
  _esriConfig.apiKey = "AAPK16dc245e51af4cd58792f446f40c58edICSmkURdJi5igB7OXHABEip3-nJYIwlv1PBR87gdjey1CAdMES1tgYBrPqjDZhFo";
  _esriConfig.request.proxyUrl = URL_proxy;
  _esriConfig.timeout = 600000;
  _esriConfig.request.interceptors.push({
    // Captura las peticiones a la URL de impresión
    urls: URL_Print_Services,

    before: function (params) {
      // Quita los labels en la leyenda
      let webMapJson = JSON.parse(params.requestOptions.query.Web_Map_as_JSON);

      if (webMapJson.layoutOptions.legendOptions.operationalLayers.length > 0) {
        for (
          let idxOperationalLayer = 0; idxOperationalLayer <
          webMapJson.layoutOptions.legendOptions.operationalLayers.length; idxOperationalLayer++
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
      // console.log(response);
    },
  });

  // map
  map = new _Map();

  // View
  view = new _MapView({
    container: "mapViewDiv",
    map: map,
    zoom: zoomInicial,
    center: centerInicial,
    padding: {
      top: 50,
      bottom: 0,
    },
    ui: {
      components: [],
    },
  });

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

    // Carga automaticamente los datos del modelo integrado
    // loadDataVGV();

    $("#escalaImpresion").val(formatNumber(parseInt(view.scale)));

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

    if (yearParameter != null || variableParameter != null || filtroParameter != null) {
      aplicarParametrosVGV();
    }

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

function addWidgets() {
  // Map widgets
  const home = new _Home({
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
    selectionEnabled: true
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
      _Basemap.fromId("arcgis-streets-night")
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

  var handle = basemapGallery.watch("activeBasemap", function (basemap) {
    current_reportes = arrayRemove(current_reportes, "mapa base");
    reporteUso("mapa base", basemap.title, "load");
    // generateColors();
    // for (let index = 0; index < map.layers.items.length; index++) {
    //   const tLayer = map.layers.items[index];
    //   if (
    //     tLayer.id.startsWith("Results_Base_") ||
    //     tLayer.id.startsWith("Time_")
    //   ) {
    //     generateSimbology(tLayer);
    //   }
    // }
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
    coordinateSegments: [{
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
    coordinateSegments: [{
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
    coordinateSegments: [{
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
    coordinateSegments: [{
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
    coordinateSegments: [{
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
    coordinateSegments: [{
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
    coordinateSegments: [{
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
    coordinateSegments: [{
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

  var print = new _Print({
    view: view,
    container: "printDiv",
    // specify your own print service
    printServiceUrl: "https://vgv.unidadvictimas.gov.co/server/rest/services/GP_UARIV/Imprimir/GPServer/Export%20Web%20Map"
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
  view.ui.add([{
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
  view.popup.watch('selectedFeature', function (gra) {
    if (gra) {
      view.graphics.removeAll();
      var h = view.highlightOptions;

      gra.symbol = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [h.color.r, h.color.g, h.color.b, 0.1],
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [h.color.r, h.color.g, h.color.b, h.color.a],
          width: 1
        }
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
      view.goTo(tLayer.fullExtent);
    } else if (id === "delete-layer") {
      collapseExpand(null);
      closeTabla();

      if (current_layers.indexOf(tLayer.id) != -1) {
        hideLayer(tLayer.id);
      }

      schemeLayer = schemeLayer.filter(function (item) {
        return item.idLayer != tLayer.id;
      });

      consulta_layers = consulta_layers.filter(function (item) {
        return item != tLayer.id;
      });

      vgv_filter_Hechos = vgv_filter_Hechos.filter(function (item) {
        return item.Title != tLayer.id;
      });

      if (schemeLayer.indexOf(tLayer.id) != -1) {
        hideLayer(tLayer.id);
      }

      if (schemeLayer.length == 0 && current_layers == 0) {
        if (LegendExpand.expanded) {
          LegendExpand.collapse();
        }
      }

      removeOptionSwipe(tLayer);
      map.remove(tLayer);
    } else if (id === "simbology-layer") {
      collapseExpand(null);
      closeSimbology();
      gotoSimbology(tLayer);
    } else if (id === "tabla-layer") {
      collapseExpand(null);

      loading = $.dialog({
        title: "",
        content: "",
        onContentReady: function () {
          this.showLoading(false);
        },
      });

      if (tLayer.type == 'feature') {
        generateTableFeature(tLayer);
      } else if (tLayer.type == 'map-image') {
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

  let actionFullExtent = [{
    title: "Mapa completo",
    className: "esri-icon-globe",
    id: "full-extent",
  }, ];

  let actionTable = [{
    title: "Ver tabla",
    className: "esri-icon-table",
    id: "tabla-layer",
  }, ];

  let actionTableDefault = [{
    title: "Ver tabla",
    className: "esri-icon-table",
    id: "tabla-layer-default",
  }, ];

  let actionChart = [{
    title: "Ver gráficas",
    className: "esri-icon-chart",
    id: "chart-layer",
  }, ];

  let actionTransparency = [{
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

  let actionSimbology = [{
    title: "Ajustar simbologia",
    className: "esri-icon-settings",
    id: "simbology-layer",
  }, ];

  let actionDelete = [{
    title: "Borrar capa",
    className: "esri-icon-trash",
    id: "delete-layer",
  }, ];

  let itemConfigLayers = config_layers.filter(function (element) {
    return element.ID_SERVICIO == item.layer.id.toString();
  });

  if (consulta_layers.indexOf(item.layer.id.toString()) != -1) {
    item.actionsSections = [
      actionFullExtent,
      actionTable,
      actionChart,
      actionTransparency,
      actionSimbology,
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
      actionSimbology,
      actionDelete,
    ];
  }
}

function collapseExpand(widgetExpand) {
  for (let i = 0; i < expandWidgets.length; i++) {
    if (expandWidgets[i] !== widgetExpand) {
      if (expandWidgets[i].expanded) {
        expandWidgets[i].collapse();
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

  buildSelectMultiple(
    "selectFiltro_Hecho",
    vgv_lstHechos,
    "code",
    "name",
    "Todos los Hechos",
    null
  );
  buildSelectMultiple(
    "selectFiltro_Genero",
    vgv_lstSexo,
    "code",
    "name",
    "Todos los Generos",
    null
  );
  buildSelectMultiple(
    "selectFiltro_Etnia",
    vgv_lstEtnia,
    "code",
    "name",
    "Todas las Etnias",
    null
  );
  buildSelectMultiple(
    "selectFiltro_CicloVital",
    vgv_lstCicloVital,
    "code",
    "name",
    "Todos los Ciclos",
    null
  );
  buildSelectMultiple(
      "selectFiltro_Discapacidad",
      vgv_lstDiscapacidad,
      "code",
      "name",
      "Todas los Discapa",
      null
    ),
    buildSelectMultiple(
      "selectFiltro_Departamento",
      vgv_lstDepartamentos,
      "DANE_DEPTO",
      "DEPARTAMENTO",
      "Todos los Dptos",
      null
    );
  buildSelectMultiple(
    "selectFiltro_Municipios",
    vgv_lstMunicipios,
    "DANE_MUNICIPIO",
    "MUNICIPIO",
    "Todos los Mpios",
    "DEPARTAMENTO"
  );
  buildSelectMultiple(
    "selectFiltro_DT",
    vgv_lstDT,
    "COD_TERRITORIAL",
    "DIR_TERRITORIAL",
    "Todas los DT",
    null
  );
  buildSelectMultiple(
    "selectFiltro_PDET",
    vgv_lstPDET,
    "COD_PDET",
    "NOMBRE_PDET",
    "Todos los PDET",
    null
  );
}

function cambioFiltroGeografico() {
  let filtroGeograficoSeleccionado = $("#selectFiltro_Geografico").val();

  if (filtroGeograficoSeleccionado == "filtroDepartamento") {
    // buildSelectMultiple("selectFiltro_Departamento", vgv_lstDepartamentos, "DANE_DEPTO", "DEPARTAMENTO", "Todos los Departamentos")
    // buildSelectMultiple("selectFiltro_Municipios", vgv_lstMunicipios, "DANE_MUNICIPIO", "MUNICIPIO", "Todos los Municipios")

    $("#divFiltroGeograficoDT").hide();
    $("#divFiltroGeograficoPDET").hide();
    $("#divFiltroGeograficoMunicipio").hide();
    $("#divFiltroGeograficoDepartamento").show();
  } else if (filtroGeograficoSeleccionado == "filtroMunicipal") {
    // buildSelectMultiple("selectFiltro_Departamento", vgv_lstDepartamentos, "DANE_DEPTO", "DEPARTAMENTO", "Todos los Departamentos")
    // buildSelectMultiple("selectFiltro_Municipios", vgv_lstMunicipios, "DANE_MUNICIPIO", "MUNICIPIO", "Todos los Municipios")

    $("#divFiltroGeograficoDT").hide();
    $("#divFiltroGeograficoPDET").hide();
    $("#divFiltroGeograficoDepartamento").show();
    $("#divFiltroGeograficoMunicipio").show();
  } else if (filtroGeograficoSeleccionado == "filtroDT") {
    // buildSelectMultiple("selectFiltro_Departamento", vgv_lstDepartamentosDT, "DANE_DEPTO", "DEPARTAMENTO", "Todos los Departamentos")
    // buildSelectMultiple("selectFiltro_Municipios", vgv_lstMunicipiosDT, "DANE_MUNICIPIO", "MUNICIPIO", "Todos los Municipios")

    $("#divFiltroGeograficoPDET").hide();
    $("#divFiltroGeograficoDepartamento").hide();
    $("#divFiltroGeograficoMunicipio").hide();
    $("#divFiltroGeograficoDT").show();
  } else if (filtroGeograficoSeleccionado == "filtroPDET") {
    // buildSelectMultiple("selectFiltro_Departamento", vgv_lstDepartamentosPDET, "DANE_DEPTO", "DEPARTAMENTO", "Todos los Departamentos")
    // buildSelectMultiple("selectFiltro_Municipios", vgv_lstMunicipiosPDET, "DANE_MUNICIPIO", "MUNICIPIO", "Todos los Municipios

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
      if (data.status) {
        if (data.servicios != null) {
          for (var i = 0; i < data.servicios.length; i++) {
            if (
              config_layers.find(function (item) {
                return item.ID_SERVICIO == data.servicios[i].ID_SERVICIO;
              }) == null &&
              data.servicios[i].ID_CATEGORIA != categoriaBaseOcultos
            ) {
              config_layers.push(data.servicios[i]);
            } else if (
              base_layers.find(function (item) {
                return item.ID_SERVICIO == data.servicios[i].ID_SERVICIO;
              }) == null &&
              data.servicios[i].ID_CATEGORIA == categoriaBaseOcultos
            ) {
              base_layers.push(data.servicios[i]);
            }
          }
          reporteUso("catalogo", "", "load");
          gotoAgregar();
        }
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

      for (let index = 0; index < dataPakoJSON.length; index++) {
        const element = dataPakoJSON[index];

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
    url: URL_RUV_FECHACORTE
  });

  var query = new _Query();
  query.returnGeometry = false;
  query.outFields = ["*"];
  query.where = "1=1";

  queryTask.execute(query).then(function (results) {
    let infoVGV = results.features[0].attributes
    FechaCorte = infoVGV.RUV_CFECHA;
    $("#FechaCorteVGV").html("FECHA DE CORTE: " + infoVGV.RUV_CFECHA);
    $("#CountPersonasVGV").html(
      "VÍCTIMAS CONFLICTO ARMADO: " + formatNumber(infoVGV.RUV_NPERSONAS)
    );
    $("#CountSujetosVGV").html(
      "SUJETOS DE ATENCIÓN: " + formatNumber(infoVGV.RUV_NSUJETOS)
    );
    $("#CountEventosVGV").html("EVENTOS: " + formatNumber(infoVGV.RUV_NEVENTOS));

    $("#DefinitionPersonasVGV").html(infoVGV.RUV_CPERSONAS);
    $("#DefinitionSujetosVGV").html(infoVGV.RUV_CSUJETOS);
    $("#DefinitionEventosVGV").html(infoVGV.RUV_CEVENTOS);
  }, function (error) {
    console.log('Error FechaCorte: ', error);
  });
}

function loadDomainsVGV() {
  const table = new _FeatureLayer({
    url: URL_RUV_DATOS
  });
  table.load().then(function () {
    const fields = table.sourceJSON.fields;
    fields.forEach(field => {
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

function loadDataVGV() {
  for (let idxAnio = 0; idxAnio < vgv_lstAnios.length; idxAnio++) {
    let numAnio = vgv_lstAnios[idxAnio].toString();
    let datosAnio = vgv_compress_Hechos.filter(function (item) {
      return item.Anio == numAnio;
    });

    if (datosAnio.length == 0) {
      $.ajax({
        url: URL_HechosBuscar_Services + numAnio + "C.json",
        success: function (data) {
          vgv_compress_Hechos.push({
            Data: data,
            Anio: numAnio,
          });
        },
        error: function (xhr, status, error) {
          alerta(
            "No se pudieron cargar los datos desde la Base de Datos\n\nPor favor intente acceder al visor más tarde."
          );
          console.log(error);
        },
      });
    }
  }
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

// Buscar los datos en la base de datos

function getSqlParameter(domFilter, nombreCampo) {
  let parameterSelected = $("#" + domFilter + " option:selected");
  let parameterOptions = $("#" + domFilter + " option");

  if (parameterSelected.length < parameterOptions.length) {
    let parametrosSeleccionados = parameterSelected.map(function (a, item) {
      return parseInt(item.value);
    });

    let strSQL = nombreCampo + ' IN (';
    strSQL += parametrosSeleccionados.toArray().toString();
    strSQL += ") AND ";
    return strSQL;
  } else {
    return '';
  }
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

  let tableRUV;
  let popupContent;
  let variableRUV = $("#selectFiltro_Variable option:selected").text();
  let Anio = $("#selectFiltro_Anio").val();

  let strFrom = ', SUM(RUV_N' + $("#selectFiltro_Variable").val() + ') AS VGV_NVALOR FROM GIS2.RUV.RUV_DATOS ';
  let strWhere = "WHERE RUV_CVIGENCIA = '" + Anio + "' AND ";
  strWhere += getSqlParameter('selectFiltro_Hecho', 'RUV_NHECHO');
  strWhere += getSqlParameter('selectFiltro_Genero', 'RUV_NSEXO');
  strWhere += getSqlParameter('selectFiltro_Etnia', 'RUV_NETNIA');
  strWhere += getSqlParameter('selectFiltro_Discapacidad', 'RUV_NDISCAPACIDAD');
  strWhere += getSqlParameter('selectFiltro_CicloVital', 'RUV_NCICLOVITAL');

  if (filtroGeografico == "filtroDepartamento") {
    strFrom = strSQL_Dptos + ' FROM GIS2.Publicacion.DEPARTAMENTOS G LEFT JOIN (SELECT DPTO_NCDGO' + strFrom;
    strWhere += getSqlParameter('selectFiltro_Departamento', 'DPTO_NCDGO');
    strWhere += ' (1 = 1) GROUP BY DPTO_NCDGO) AS D ON G.DPTO_NCDGO = D.DPTO_NCDGO';

    tableRUV = 'Departamentos';
    popupContent = `Durante el año <b>${Anio}</b> se presentaron <b>{VGV_NVALOR} ${variableRUV}</b> en el ${tableRUV} de <b>{VGV_CNMBR}</b>.`;

  } else if (filtroGeografico == "filtroMunicipal") {
    strFrom = strSQL_Mpios + ' FROM GIS2.Publicacion.MUNICIPIOS G LEFT JOIN (SELECT MPIO_NCDGO' + strFrom;
    strWhere += getSqlParameter('selectFiltro_Municipios', 'MPIO_NCDGO');
    strWhere += ' (1 = 1) GROUP BY MPIO_NCDGO) AS D ON G.MPIO_NCDGO = D.MPIO_NCDGO';

    tableRUV = 'Municipios';
    popupContent = `Durante el año <b>${Anio}</b> se presentaron <b>{VGV_NVALOR} ${variableRUV}</b> en el ${tableRUV} de <b>{VGV_CNMBR}</b>.`;

  } else if (filtroGeografico == "filtroDT") {
    strFrom = strSQL_DT + ' FROM GIS2.Publicacion.DT G LEFT JOIN (SELECT DT_NCDGO' + strFrom;
    strWhere += getSqlParameter('selectFiltro_DT', 'DT_NCDGO');
    strWhere += ' (1 = 1) GROUP BY DT_NCDGO) AS D ON G.DT_NCDGO = D.DT_NCDGO';

    tableRUV = 'DT';
    popupContent = `Durante el año <b>${Anio}</b> se presentaron <b>{VGV_NVALOR} ${variableRUV}</b> en el <b>{VGV_CNMBR}</b>.`;

  } else if (filtroGeografico == "filtroPDET") {
    strFrom = strSQL_PDET + ' FROM GIS2.Publicacion.PDET G LEFT JOIN (SELECT PDET_NCDGO' + strFrom;
    strWhere += getSqlParameter('selectFiltro_PDET', 'PDET_NCDGO');
    strWhere += ' (1 = 1) GROUP BY PDET_NCDGO) AS D ON G.PDET_NCDGO = D.PDET_NCDGO';

    tableRUV = 'PDET';
    popupContent = `Durante el año <b>${Anio}</b> se presentaron <b>{VGV_NVALOR} ${variableRUV}</b> en el <b>{VGV_CNMBR}</b>.`;

  }

  let titleRUV = variableRUV + ' por ' + tableRUV + ' para el año ' + Anio;
  let idLayerRUV = "Results_" + tableRUV + "_" + $("#selectFiltro_Variable").val() + "_" + Anio;

  if (map.findLayerById(idLayerRUV)) {
    map.remove(map.findLayerById(idLayerRUV));
  }

  const layerRUV = new _MapImageLayer({
    url: URL_RUV,
    title: titleRUV,
    id: idLayerRUV,
    visible: true,
    sublayers: [{
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
          query: strFrom + strWhere,
          geometryType: "polygon",
          spatialReference: {
            "wkid": 4326
          },
          oidFields: "objectid"
        }
      }
    }]
  });

  const subLayerRUV = layerRUV.sublayers.find(function (sublayer) {
    return sublayer.id === 0;
  });

  subLayerRUV.createFeatureLayer()
    .then(function (eventosFeatureLayer) {
      return eventosFeatureLayer.load();
    })
    .then(function (featureLayer) {
      createRenderer(featureLayer, subLayerRUV, layerRUV)
    });

  subLayerRUV.popupTemplate = {
    title: "<b>" + titleRUV + "</b>",
    content: popupContent,
    fieldInfos: [{
      fieldName: "VGV_NVALOR",
      format: {
        digitSeparator: true,
        places: 0
      }
    }, {
      fieldName: "VGV_CNMBR",
    }]
  };

  closeParametrosVGV();

}

function createRenderer(featureLayer, subLayer, layerRUV) {
  const schemes = _colorSchemes2.getSchemeByName({
    name: 'Red 5',
    geometryType: featureLayer.geometryType,
    theme: "high-to-low"
  });

  const params = {
    layer: featureLayer,
    field: "VGV_NVALOR",
    view: view,
    classificationMethod: "natural-breaks",
    numClasses: 5,
    colorScheme: schemes
  };

  _colorRendererCreator2
    .createClassBreaksRenderer(params)
    .then(function (rendererResponse) {
      rendererResponse.renderer.defaultLabel = "Sin Datos";
      rendererResponse.renderer.defaultSymbol.color.a = 0.7;
      subLayer.renderer = rendererResponse.renderer;

      map.add(layerRUV);

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

  for (let idxList = 0; idxList < listSelect.length; idxList++) {
    $("#" + listSelect[idxList]).multiselect("selectAll", false);
    $("#" + listSelect[idxList]).multiselect("updateButtonText");
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

/*
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
*/

// Tiempo

function createTimeVGV() {
  if (sliderTimeRange.values[0] == sliderTimeRange.values[1]) {
    alerta(
      "El año de inicio y fin del deslizador del tiempo no pueden ser el mismo"
    );
    return;
  } else {
    loading = $.dialog({
      title: "",
      content: "",
      onContentReady: function () {
        this.showLoading(false);
      },
    });

    sliderTime.min = sliderTimeRange.values[0];
    sliderTime.max = sliderTimeRange.values[1];

    $("#createTimeVGV").hide();
    $("#createTimeVGV").hide();

    vgv_group_Hechos = [];

    for (let idxAnio = 0; idxAnio < vgv_lstAnios.length; idxAnio++) {
      if (map.findLayerById("Time_" + vgv_lstAnios[idxAnio])) {
        map.remove(map.findLayerById("Time_" + vgv_lstAnios[idxAnio]));
      }
    }

    current_reportes = arrayRemove(current_reportes, "TimeSlider");
    reporteUso(
      "TimeSlider",
      sliderTimeRange.values[0] + " - " + sliderTimeRange.values[1],
      "create"
    );

    setTimeout(function () {
      for (let idxAnio = 0; idxAnio < vgv_lstAnios.length; idxAnio++) {
        if (
          vgv_lstAnios[idxAnio] >= sliderTimeRange.values[0] &&
          vgv_lstAnios[idxAnio] <= sliderTimeRange.values[1]
        ) {
          loadHechosVictimas(vgv_lstAnios[idxAnio], false);
        }
      }

      setTimeout(function () {
        timeHechosVictimas();
      }, (sliderTime.max - sliderTime.min) * 300);

    }, 500);
  }
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

function setTimeYear(value) {
  var sliderValue = document.getElementById("sliderValue");
  sliderValue.innerHTML = Math.floor(value);
  sliderTime.viewModel.setValue(0, value);

  offLayersTime();
  map.findLayerById("Time_" + Math.floor(value).toString()).visible = true;

  // layer.renderer = createRenderer(value);
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

function displayTimeVGV() {
  sliderTime.on("thumb-drag", inputTimeHandler);

  setTimeYear(sliderTimeRange.values[0]);
  let tLayerTimeInicial = map.findLayerById(
    "Time_" + sliderTimeRange.values[0].toString()
  );
  tLayerTimeInicial.when(function () {
    $("#sliderContainerTime").show();
    $("#legendTimeVGV").show();
    $("#deleteTimeVGV").show();
    $("#settingsTime").show();
    $("#helpTimeVGV").removeClass("in");

    if (loading.isOpen()) {
      loading.close();
    }
  });
}

function offLayersTime() {
  for (let idxAnio = 0; idxAnio < vgv_lstAnios.length; idxAnio++) {
    if (
      vgv_lstAnios[idxAnio] >= sliderTimeRange.values[0] &&
      vgv_lstAnios[idxAnio] <= sliderTimeRange.values[1]
    ) {
      if (
        map.findLayerById("Time_" + vgv_lstAnios[idxAnio].toString()).visible
      ) {
        map.findLayerById(
          "Time_" + vgv_lstAnios[idxAnio].toString()
        ).visible = false;
      }
    }
  }
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

// Graficas
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

function generateDataChart(tLayer) {
  vgv_graphic_hechos = [];

  let filterDataLayer = vgv_filter_Hechos.filter(function (item) {
    return item.Title == tLayer.id;
  })[0].DataFilter;

  vgv_graphic_hechos.push({
    Parametros: "HECHO",
    DataGroup: agruparHechosVictimas(filterDataLayer, "HECHO"),
  });
  vgv_graphic_hechos.push({
    Parametros: "SEXO",
    DataGroup: agruparHechosVictimas(filterDataLayer, "SEXO"),
  });
  vgv_graphic_hechos.push({
    Parametros: "ETNIA",
    DataGroup: agruparHechosVictimas(filterDataLayer, "ETNIA"),
  });
  vgv_graphic_hechos.push({
    Parametros: "DISCAPACIDAD",
    DataGroup: agruparHechosVictimas(filterDataLayer, "DISCAPACIDAD"),
  });
  vgv_graphic_hechos.push({
    Parametros: "CICLO_VITAL",
    DataGroup: agruparHechosVictimas(filterDataLayer, "CICLO_VITAL"),
  });

  $("#tituloChart").text("Gráficos - " + tLayer.title);
  $("#panelChartP").data("idLayer", tLayer.id);
  $("#panelChartP").show();
  generateVisualChart();

  current_reportes = arrayRemove(current_reportes, "chart");
  reporteUso("chart", tLayer.id, "load");
}

function generateVisualChart() {
  let variableValueChart = $("#settingsVariableChart").val();
  let variableTextChart = $("#settingsVariableChart option:selected").text();

  let parametro1ValueChart = $("#settingsParametro1Chart").val();
  let parametro1TextChart = $(
    "#settingsParametro1Chart option:selected"
  ).text();

  let parametro2ValueChart = $("#settingsParametro2Chart").val();
  let parametro2TextChart = $(
    "#settingsParametro2Chart option:selected"
  ).text();

  let tipoValueChart = $("#settingsTipoChart").val();

  if (tipoValueChart == "heatmap") {
    generateVisual2DChart(
      parametro1ValueChart,
      parametro2ValueChart,
      variableValueChart
    );
  } else {
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
      dataChart = [{
        labels: labelsGroupChart,
        values: variableGroupChart,
        textposition: "inside",
        automargin: true,
        type: "pie",
      }, ];

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
        // margin: {
        //   l: 50,
        //   r: 50,
        //   b: 100,
        //   t: 50,
        //   pad: 4
        // },
        showlegend: true,
        legend: {
          orientation: orientationLeyend,
        },
      };
    } else if (tipoValueChart == "Bar") {
      let d3colors = Plotly.d3.scale.category20();
      let listColors = [];

      for (
        let idxLabels = 0; idxLabels < labelsGroupChart.length; idxLabels++
      ) {
        listColors.push(d3colors(idxLabels));
      }

      dataChart = [{
        x: labelsGroupChart,
        y: variableGroupChart,
        marker: {
          color: listColors,
        },
        type: "bar",
      }, ];

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
}

function generateVisual2DChart() {
  let variableValueChart = $("#settingsVariableChart").val();
  let variableTextChart = $("#settingsVariableChart option:selected").text();

  let parametro1ValueChart = $("#settingsParametro1Chart").val();
  let parametro1TextChart = $(
    "#settingsParametro1Chart option:selected"
  ).text();

  let parametro2ValueChart = $("#settingsParametro2Chart").val();
  let parametro2TextChart = $(
    "#settingsParametro2Chart option:selected"
  ).text();

  let idLayer = $("#panelChartP").data("idLayer");
  let filterDataLayer = vgv_filter_Hechos.filter(function (item) {
    return item.Title == idLayer;
  })[0].DataFilter;

  let listData = agruparHechosVictimasMulti(
    filterDataLayer,
    parametro1ValueChart,
    parametro2ValueChart
  );

  for (let idxList = listData.length - 1; idxList >= 0; idxList--) {
    if (listData[idxList][parametro1ValueChart] == "SIN DEFINIR") {
      listData.splice(idxList, 1);
    }
  }

  listDataGeo = agruparHechosVictimas(listData, parametro1ValueChart);
  listDataVar = agruparHechosVictimas(listData, parametro2ValueChart);

  let labelDataGeo = listDataGeo.map(function (item) {
    return item.VAR_AGRUPACION;
  });
  let labelDataVar = listDataVar.map(function (item) {
    return item.VAR_AGRUPACION;
  });

  let dataValuesGraph = [];

  for (let idxGeo = 0; idxGeo < labelDataGeo.length; idxGeo++) {
    let dataValuesGraphRow = [];
    for (let idxVar = 0; idxVar < labelDataVar.length; idxVar++) {
      let entroVar = false;
      for (let idxData = 0; idxData < listData.length; idxData++) {
        if (
          listData[idxData][parametro1ValueChart] == labelDataGeo[idxGeo] &&
          listData[idxData][parametro2ValueChart] == labelDataVar[idxVar]
        ) {
          dataValuesGraphRow.push(listData[idxData][variableValueChart]);
          entroVar = true;
          break;
        }
      }
      if (!entroVar) {
        dataValuesGraphRow.push(0);
      }
    }
    dataValuesGraph.push(dataValuesGraphRow);
  }

  let colorscaleValue = [
    [0, "#ffffff"],
    [0.0001, "#a6bddb"],
    [0.005, "#3690c0"],
    [0.1, "#045a8d"],
    [0.15, "#fdbb84"],
    [0.2, "#fc8d59"],
    [0.25, "#ef6548"],
    [0.4, "#d7301f"],
    [0.5, "#b30000"],
    [1, "#7f0000"],
  ];

  let dataHeatMap = [{
    z: dataValuesGraph,
    x: labelDataVar,
    y: labelDataGeo,
    colorscale: colorscaleValue,
    type: "heatmap",
    // reversescale: true,
    hoverongaps: false,
  }, ];

  Plotly.purge("chartFilterData");
  $("#panelChartP").show();

  let layoutChart = {
    title: {
      text: variableTextChart +
        " por " +
        parametro1TextChart +
        " vs " +
        parametro2TextChart,
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

  let config = {
    responsive: true,
    displayModeBar: true,
    locale: "es",
    displaylogo: false,
  };

  Plotly.newPlot("chartFilterData", dataHeatMap, layoutChart, config);
}

// tabla
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
  if (tLayer.id.startsWith('Results_')) {
    const subLayer = tLayer.sublayers.find(function (sublayer) {
      return sublayer.id === 0;
    });

    generateTableFeature(subLayer)
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

    for (let idxField = 0; idxField < TableFields.length; idxField++) {
      if (TableFields[idxField].field == "VGV_NVALOR") {
        TableFields[idxField].topCalc = function (values, data, calcParams) {
          if (values && values.length) {
            var total = values.reduce((sum, x) => sum + (parseInt(x) || 0));
            return "Total: " + formatNumber(total);
          }
        };
      }
    }

    let widthTable = 0;
    for (let indexField = 0; indexField < TableFields.length; indexField++) {
      if (TableFields[indexField].field == "VGV_NVALOR") {
        TableFields[indexField].title = tituloResultados;
      }
      if (TableFields[indexField].hasOwnProperty("width")) {
        widthTable += TableFields[indexField].width;
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

    for (let idxField = 0; idxField < fieldsLayer.length; idxField++) {
      if (
        fieldsLayer[idxField].name == "OBJECTID" ||
        fieldsLayer[idxField].name == "Shape__Length" ||
        fieldsLayer[idxField].name == "Shape.LEN" ||
        fieldsLayer[idxField].name == "Shape__Area" ||
        fieldsLayer[idxField].name == "Shape.AREA"
      ) {
        // pass
      } else if (fieldsLayer[idxField].name == "OBJECTID") {
        TableFields.push({
          field: "OBJECTID",
          visible: false,
        });
      } else {
        let widthField = fieldsLayer[idxField].length;
        if (widthField < 30) {
          widthField = 150;
        } else {
          widthField = widthField * 3;
        }

        widthTable += widthField;

        let fieldDefinition = {
          field: fieldsLayer[idxField].name,
          title: fieldsLayer[idxField].alias,
          sorter: "string",
          visible: true,
          width: widthField,
        };

        if (fieldsLayer[idxField].type == "string") {
          fieldDefinition.headerFilter = "input";
          fieldDefinition.headerFilterPlaceholder =
            "Buscar " + fieldsLayer[idxField].alias;
        }

        if (fieldsLayer[idxField].type == "date") {
          dateFields.push(fieldsLayer[idxField].name);
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
        for (let idxField = 0; idxField < dateFields.length; idxField++) {
          attributeFeature[dateFields[idxField]] = getDateText(
            attributeFeature[dateFields[idxField]]
          );
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

    if (tLayer.type == 'map-image' && tLayer.id.startsWith('Results_')) {
      tLayer = tLayer.sublayers.find(function (sublayer) {
        return sublayer.id === 0;
      });
    } else if (tLayer.type == 'feature') {
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

//Swipe
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

    for (let idxLayer = 0; idxLayer < izqLayers.length; idxLayer++) {
      if (izqLayers[idxLayer].id == tLayer.id) {
        removeSwipe();
        return;
      }
    }

    for (let idxLayer = 0; idxLayer < derLayers.length; idxLayer++) {
      if (derLayers[idxLayer].id == tLayer.id) {
        removeSwipe();
        return;
      }
    }
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

function activeFirstLegend() {
  let cardsLegend = document.getElementsByClassName(
    "esri-legend--card__carousel-indicator"
  );

  for (let idxCard = 0; idxCard < cardsLegend.length; idxCard++) {
    if (cardsLegend[idxCard].title.startsWith("1 ")) {
      cardsLegend[idxCard].click();
    }
  }
}

// Agregar servicios web geograficos

function gotoAgregar() {
  if ($("#servicesList").html() == "") {
    let currentCategoria = null;
    let currentCategoriaCount = 0;
    let currentSubCategoria = null;
    let currentSubCategoriaCount = 0;

    for (let i = 0; i < config_layers.length; i++) {
      if (currentCategoria != config_layers[i].ID_CATEGORIA) {
        if (currentCategoria != null) {
          $(
            "[data-categoria-group='" + currentCategoria + "'] > div > a > span"
          ).html("&nbsp;(" + (currentCategoriaCount + 1) + ")");
        }
        currentCategoria = config_layers[i].ID_CATEGORIA;
        currentCategoriaCount = 0;
        let strCatHTML = "";
        strCatHTML =
          strCatHTML +
          "<li data-categoria-group='" +
          config_layers[i].ID_CATEGORIA +
          "' class='list-group-item activec'>";
        strCatHTML = strCatHTML + "<div class='media-left'>";
        strCatHTML =
          strCatHTML +
          "<a href='#' class='linkVGV' style='font-weight: bold;' onclick='showCategory(" +
          config_layers[i].ID_CATEGORIA +
          ");'></a>";
        strCatHTML = strCatHTML + "</div>";
        strCatHTML =
          strCatHTML +
          "<div class='media-body' style='vertical-align: middle;'>";
        strCatHTML =
          strCatHTML +
          "<a href='#' class='linkVGV' style='font-weight: bold;' onclick='showCategory(" +
          config_layers[i].ID_CATEGORIA +
          ");'>" +
          config_layers[i].CATEGORIA +
          "<span>&nbsp;</span></a>";
        strCatHTML = strCatHTML + "</div>";
        strCatHTML = strCatHTML + "</li>";
        $("#servicesList").append(strCatHTML);
      } else {
        currentCategoriaCount = currentCategoriaCount + 1;
      }
      if (
        config_layers[i].ID_SUBCATEGORIA != undefined ||
        config_layers[i].ID_SUBCATEGORIA != null
      ) {
        if (currentSubCategoria != config_layers[i].ID_SUBCATEGORIA) {
          if (currentSubCategoria != null) {
            $(
              "[data-subcategoria-group='" +
              currentSubCategoria +
              "'] > div > a > span"
            ).html("&nbsp;(" + (currentSubCategoriaCount + 1) + ")");
          }
          currentSubCategoria = config_layers[i].ID_SUBCATEGORIA;
          currentSubCategoriaCount = 0;
          let strSubCatHTML = "";
          strSubCatHTML =
            strSubCatHTML +
            "<li  data-categoria='" +
            config_layers[i].ID_CATEGORIA +
            "' data-subcategoria-group='" +
            config_layers[i].ID_SUBCATEGORIA +
            "' class='list-group-item' style='display: none;'>";
          strSubCatHTML =
            strSubCatHTML +
            "<div class='media-body' style='vertical-align: middle;'>";
          strSubCatHTML =
            strSubCatHTML +
            "<a href='#' class='linkVGV' style='font-weight: bold;' onclick='showSubCategory(" +
            config_layers[i].ID_CATEGORIA +
            "," +
            config_layers[i].ID_SUBCATEGORIA +
            ");'>" +
            config_layers[i].SUBCATEGORIA +
            "<span>&nbsp;</span></a>";
          strSubCatHTML = strSubCatHTML + "</div>";
          strSubCatHTML = strSubCatHTML + "<div class='media-right'>";
          strSubCatHTML =
            strSubCatHTML +
            "<button type='button' style='width: 32px;height: 25px;' data-toggle='tooltip' data-placement='bottom' title='Expandir subcategoria' class='btn btn-xs btn-default' onclick='showSubCategory(" +
            config_layers[i].ID_CATEGORIA +
            "," +
            config_layers[i].ID_SUBCATEGORIA +
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
        currentSubCategoria == null ?
        "" :
        "' data-subcategoria='" + config_layers[i].ID_SUBCATEGORIA;
      let strHTML =
        "<li data-layer='" +
        config_layers[i].ID_SERVICIO +
        "' data-categoria='" +
        config_layers[i].ID_CATEGORIA +
        strHTMLSubCategoria +
        "' class='list-group-item' style='display: none;'>";

      strHTML = strHTML + "<div class='media-body' style='font-size: small;'>";
      strHTML =
        strHTML +
        "<a href='#' class='media-heading' style='font-size: small;color: black;' onclick='showDetail(" +
        config_layers[i].ID_SERVICIO +
        ");'>" +
        config_layers[i].NOMBRE +
        "</a>";

      if (config_layers[i].ID_SUBCATEGORIA == null) {
        strHTML =
          strHTML +
          "<div id='extra-data-" +
          config_layers[i].ID_SERVICIO +
          "' class='extra-data collapse'>";
      } else {
        strHTML =
          strHTML +
          "<div id='extra-data-" +
          config_layers[i].ID_SERVICIO +
          "' class='extra-data collapse' style='margin-left: 5px;'>";
      }

      if (config_layers[i].RESUMEN != null) {
        if (config_layers[i].RESUMEN != "") {
          // if (config_layers[i].RESUMEN.length > 165) {
          //   strHTML = strHTML + "<p style='margin: 0px'>" + config_layers[i].RESUMEN.trim().substring(0, 165) + "…" + "</p>";
          // } else {
          strHTML =
            strHTML +
            "<p style='margin: 0px'>" +
            config_layers[i].RESUMEN +
            "</p>";
          // }
        }
      }
      if (config_layers[i].ENTIDAD != null) {
        if (config_layers[i].ENTIDAD != "") {
          strHTML =
            strHTML +
            "<p style='margin: 0px'><b>Entidad:</b> " +
            config_layers[i].ENTIDAD +
            "</p>";
        }
      }
      if (config_layers[i].FECHA != null) {
        if (config_layers[i].FECHA != "") {
          strHTML =
            strHTML +
            "<p style='margin: 0px'><b>Fecha de actualizaci&oacute;n:</b> " +
            config_layers[i].FECHA +
            "</p>";
        }
      }
      if (config_layers[i].LICENCIA != null) {
        if (config_layers[i].LICENCIA != "") {
          strHTML =
            strHTML +
            "<p style='margin: 0px'><b>Licencia:</b> " +
            config_layers[i].LICENCIA +
            "</p>";
        }
      }
      if (
        config_layers[i].hasOwnProperty("URL2") &&
        config_layers[i].URL2 != null
      ) {
        if (config_layers[i].URL2 != "") {
          let URLShow = config_layers[i].URL2;
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
      } else {
        let URLShow = config_layers[i].URL;
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
      if (config_layers[i].URL4 != null && config_layers[i].URL4 != "") {
        strHTML =
          strHTML +
          "<a href='#' onclick='openMetadataURL(\"" +
          config_layers[i].URL4 +
          "\");'>M&aacute;s informaci&oacute;n</a>";
      } else if (config_layers[i].ID_METADATO != null) {
        strHTML =
          strHTML +
          "<a href='#' onclick='openMetadata(\"" +
          config_layers[i].ID_METADATO +
          "\");'>M&aacute;s informaci&oacute;n</a>";
      }

      strHTML = strHTML + "</div>";
      strHTML = strHTML + "</div>";
      strHTML = strHTML + "<div class='media-right'>";
      strHTML =
        strHTML +
        "<button data-layer='" +
        config_layers[i].ID_SERVICIO +
        "-Btn' type='button' data-toggle='tooltip' data-placement='bottom' title='Agregar al mapa' class='btn btn-xs btn-default' onclick='showLayer(\"" +
        config_layers[i].ID_SERVICIO +
        "\");'>";
      strHTML =
        strHTML +
        "<span class='esri-icon-plus linkVGV' style='padding-top: 5px;'></span>";
      strHTML = strHTML + "</button>";
      strHTML = strHTML + "</div>";

      strHTML = strHTML + "</li>";
      $("#servicesList").append(strHTML);
    }
    if (currentCategoria != null) {
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
  // map.infoWindow.hide();
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
    // let infoTemplate = new esri.InfoTemplate();
    // infoTemplate.setTitle(config_layers[i].NOMBRE);
    // infoTemplate.setContent(getTextContent);

    let tLayer = new _FeatureLayer({
      url: config_layers[i].URL,
      title: config_layers[i].NOMBRE,
      id: config_layers[i].ID_SERVICIO,
      outFields: ["*"],
      visible: true,
      legendEnabled: true,
    });
    tLayer.when(function () {
      reportLoad(this.id);
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
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
        sublayers: [{
          id: config_layers[i].SUBLAYER,
          visible: true
        }],
        title: config_layers[i].NOMBRE,
        id: config_layers[i].ID_SERVICIO
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

      // addOptionSwipe(tLayer);

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
  // map.infoWindow.hide();
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
  for (let i = 0; i < config_layers.length; i++) {
    if (id == config_layers[i].ID_SERVICIO) {
      if (config_layers[i].ES_SERVICIO_PROPIO == null) {
        current_reportes = arrayRemove(current_reportes, "servicios");
        reporteUso("servicios", id, "load");
      }
      break;
    }
  }
}

// CSV

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
    let settingsTitleCSV = $("#settingsTitleCSV").val() + " - Datos cargados por el usuario";
    let settingsVariableCSV = $("#settingsVariableCSV").val();

    const tLayer = map.findLayerById(lstParametros.tLayerBase);

    if (map.findLayerById(settingsTitleCSV)) {
      map.remove(map.findLayerById(settingsTitleCSV));
    }

    let query = tLayer.createQuery();
    query.where = "1=1";

    tLayer.queryFeatures(query).then(function (results) {
      for (let indexGeo = 0; indexGeo < results.features.length; indexGeo++) {
        results.features[indexGeo].attributes.OBJECTID = indexGeo;
        results.features[indexGeo].attributes.VGV_NVALOR = null;
        for (
          let indexValor = 0; indexValor < lstDatosCSV.length; indexValor++
        ) {
          if (
            parseInt(lstDatosCSV[indexValor][lstParametros.campoGeografico]) ==
            parseInt(
              results.features[indexGeo].attributes[
                lstParametros.campoGeografico
              ]
            )
          ) {
            results.features[indexGeo].attributes.VGV_NVALOR = parseFloat(
              lstDatosCSV[indexValor].VGV_NVALOR
            );
            break;
          }
        }
      }

      for (
        let indexGeo = results.features.length - 1; indexGeo >= 0; indexGeo--
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
        variableOrigen: capitalizeFirstLetter(settingsVariableCSV),
      });

      map.add(layerResults);
      generateSimbology(layerResults);

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

// Imprimir

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
  tituloMapa = tituloMapa == undefined || tituloMapa == "" ? "SinTitulo" : tituloMapa;

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
      customTextElements: [{
        FechaCorte: fechaCorteString
      }],
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
        tituloMapa + "_" + $("#plantillaImpresion").val() + "." + $("#formatoImpresion").val() +
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

// Utilidades

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

function reporteUso(caracteristica, labelEvento, accionEvento) {
  labelEvento =
    typeof labelEvento !== "undefined" &&
    labelEvento !== null &&
    labelEvento !== "" ?
    labelEvento :
    "uso";
  accionEvento =
    typeof accionEvento !== "undefined" &&
    accionEvento !== null &&
    accionEvento !== "" ?
    accionEvento :
    "uso";
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
      let charData = String.fromCharCode.apply(
        null,
        new Uint16Array(sliceDataPako)
      );
      strDataPako = strDataPako + charData;
      initDataPako += avancePako;
    } catch (error) {
      avancePako = 65000;
      let sliceDataPako = dataPako.slice(
        initDataPako,
        initDataPako + avancePako
      );
      let charData = String.fromCharCode.apply(
        null,
        new Uint16Array(sliceDataPako)
      );
      strDataPako = strDataPako + charData;
      initDataPako += avancePako;
    }
  }

  let dataPakoJSON = JSON.parse(strDataPako);

  return dataPakoJSON;
}

function convertToCSV(objArray) {
  let csv = "";
  let header = Object.keys(objArray[0]).join(";");
  let values = objArray.map((o) => Object.values(o).join(";")).join("\n");

  csv += header + "\n" + values;
  return csv;
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
  for (let index = 0; index < arrayDatos.length; index++) {
    strHTML +=
      "<option value='" +
      arrayDatos[index].nombre +
      "'>" +
      arrayDatos[index].titulo +
      "</option>";
  }
  strHTML += "</select>";

  $("#" + domSelect).html(strHTML);
  $("#" + domSelect).show();
}

function buildSelectMultiple(
  domSelect,
  arrayDatos,
  indexValue,
  indexText,
  strTodos,
  indexText2
) {
  $("#" + domSelect).multiselect("destroy");
  $("#" + domSelect).hide();

  let strHTML =
    '<select id="' +
    domSelect +
    '" multiple="multiple" data-placeholder="' +
    strTodos +
    '">';
  strHTML += '<optgroup label="' + strTodos + '">';
  for (let index = 0; index < arrayDatos.length; index++) {
    const element = arrayDatos[index];
    if (indexText == indexValue) {
      strHTML +=
        "<option value='" +
        element +
        "' selected='selected'>" +
        element +
        "</option>";
    } else if (indexText2 != null) {
      strHTML +=
        "<option value='" +
        element[indexValue] +
        "' selected='selected'>" +
        element[indexText2] +
        " - " +
        element[indexText] +
        "</option>";
    } else if (indexText2 == null) {
      strHTML +=
        "<option value='" +
        element[indexValue] +
        "' selected='selected'>" +
        element[indexText] +
        "</option>";
    }
  }
  strHTML += "</optgroup>";
  strHTML += "</select>";

  $("#" + domSelect).html(strHTML);
  $("#" + domSelect).multiselect({
    buttonWidth: $("#selectFiltro_Geografico").css("width"),
    enableClickableOptGroups: true,
    enableCollapsibleOptGroups: true,
    collapseOptGroupsByDefault: true,
    maxHeight: 300,
    // dropUp: true,
    enableFiltering: true,
    filterPlaceholder: "Filtrar...",
    enableCaseInsensitiveFiltering: true,
    allSelectedText: strTodos + "...",
    checkboxName: function (_option) {
      return "multiselect[]";
    },
    onChange: function (options, checked) {
      _this = this;
      getOptionsSelected(_this);
    },
  });

  // Ajusta los anchos de los select multiples
  // $("ul.multiselect-container > li").css("width", $("#selectFiltro_Geografico").width() + 30);
  $("#" + domSelect).show();
}

function getOptionsSelected(selectData) {
  let $selectId = selectData.$select[0].id;
  let $lenSelectAll = selectData.originalOptions.length;
  let $lenSelect = selectData.$select[0].selectedOptions.length;
  let $selectOptions = selectData.$select[0].selectedOptions;

  let filtroGeografico = $("#selectFiltro_Geografico").val();

  if (filtroGeografico == "filtroDepartamento") {} else if (filtroGeografico == "filtroMunicipal") {
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
        for (
          let indexSelected = 0; indexSelected < $selectOptions.length; indexSelected++
        ) {
          let nombreDepartamento = $selectOptions[indexSelected].text + " - ";
          const optionsMunicipios = $("#selectFiltro_Municipios")[0].options;
          for (
            let indexMunicipios = 0; indexMunicipios < optionsMunicipios.length; indexMunicipios++
          ) {
            if (
              optionsMunicipios[indexMunicipios].text.startsWith(
                nombreDepartamento
              )
            ) {
              municipiosSelected.push(optionsMunicipios[indexMunicipios].value);
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
  } else if (filtroGeografico == "filtroDT") {} else if (filtroGeografico == "filtroPDET") {} else {
    alerta("Debe seleccionar un tipo de selección espacial");
  }
  return;
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
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

function removeDiacritics(str) {
  var defaultDiacriticsRemovalMap = [{
      base: "A",
      letters: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
    },
    {
      base: "AA",
      letters: /[\uA732]/g,
    },
    {
      base: "AE",
      letters: /[\u00C6\u01FC\u01E2]/g,
    },
    {
      base: "AO",
      letters: /[\uA734]/g,
    },
    {
      base: "AU",
      letters: /[\uA736]/g,
    },
    {
      base: "AV",
      letters: /[\uA738\uA73A]/g,
    },
    {
      base: "AY",
      letters: /[\uA73C]/g,
    },
    {
      base: "B",
      letters: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
    },
    {
      base: "C",
      letters: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
    },
    {
      base: "D",
      letters: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
    },
    {
      base: "DZ",
      letters: /[\u01F1\u01C4]/g,
    },
    {
      base: "Dz",
      letters: /[\u01F2\u01C5]/g,
    },
    {
      base: "E",
      letters: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
    },
    {
      base: "F",
      letters: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,
    },
    {
      base: "G",
      letters: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
    },
    {
      base: "H",
      letters: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
    },
    {
      base: "I",
      letters: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
    },
    {
      base: "J",
      letters: /[\u004A\u24BF\uFF2A\u0134\u0248]/g,
    },
    {
      base: "K",
      letters: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
    },
    {
      base: "L",
      letters: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
    },
    {
      base: "LJ",
      letters: /[\u01C7]/g,
    },
    {
      base: "Lj",
      letters: /[\u01C8]/g,
    },
    {
      base: "M",
      letters: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
    },
    {
      base: "N",
      letters: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
    },
    {
      base: "NJ",
      letters: /[\u01CA]/g,
    },
    {
      base: "Nj",
      letters: /[\u01CB]/g,
    },
    {
      base: "O",
      letters: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
    },
    {
      base: "OI",
      letters: /[\u01A2]/g,
    },
    {
      base: "OO",
      letters: /[\uA74E]/g,
    },
    {
      base: "OU",
      letters: /[\u0222]/g,
    },
    {
      base: "P",
      letters: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
    },
    {
      base: "Q",
      letters: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,
    },
    {
      base: "R",
      letters: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
    },
    {
      base: "S",
      letters: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
    },
    {
      base: "T",
      letters: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
    },
    {
      base: "TZ",
      letters: /[\uA728]/g,
    },
    {
      base: "U",
      letters: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
    },
    {
      base: "V",
      letters: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
    },
    {
      base: "VY",
      letters: /[\uA760]/g,
    },
    {
      base: "W",
      letters: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
    },
    {
      base: "X",
      letters: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,
    },
    {
      base: "Y",
      letters: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
    },
    {
      base: "Z",
      letters: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
    },
    {
      base: "a",
      letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
    },
    {
      base: "aa",
      letters: /[\uA733]/g,
    },
    {
      base: "ae",
      letters: /[\u00E6\u01FD\u01E3]/g,
    },
    {
      base: "ao",
      letters: /[\uA735]/g,
    },
    {
      base: "au",
      letters: /[\uA737]/g,
    },
    {
      base: "av",
      letters: /[\uA739\uA73B]/g,
    },
    {
      base: "ay",
      letters: /[\uA73D]/g,
    },
    {
      base: "b",
      letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
    },
    {
      base: "c",
      letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
    },
    {
      base: "d",
      letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
    },
    {
      base: "dz",
      letters: /[\u01F3\u01C6]/g,
    },
    {
      base: "e",
      letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
    },
    {
      base: "f",
      letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,
    },
    {
      base: "g",
      letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
    },
    {
      base: "h",
      letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
    },
    {
      base: "hv",
      letters: /[\u0195]/g,
    },
    {
      base: "i",
      letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
    },
    {
      base: "j",
      letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,
    },
    {
      base: "k",
      letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
    },
    {
      base: "l",
      letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
    },
    {
      base: "lj",
      letters: /[\u01C9]/g,
    },
    {
      base: "m",
      letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
    },
    {
      base: "n",
      letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
    },
    {
      base: "nj",
      letters: /[\u01CC]/g,
    },
    {
      base: "o",
      letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
    },
    {
      base: "oi",
      letters: /[\u01A3]/g,
    },
    {
      base: "ou",
      letters: /[\u0223]/g,
    },
    {
      base: "oo",
      letters: /[\uA74F]/g,
    },
    {
      base: "p",
      letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
    },
    {
      base: "q",
      letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,
    },
    {
      base: "r",
      letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
    },
    {
      base: "s",
      letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
    },
    {
      base: "t",
      letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
    },
    {
      base: "tz",
      letters: /[\uA729]/g,
    },
    {
      base: "u",
      letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
    },
    {
      base: "v",
      letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
    },
    {
      base: "vy",
      letters: /[\uA761]/g,
    },
    {
      base: "w",
      letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
    },
    {
      base: "x",
      letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,
    },
    {
      base: "y",
      letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
    },
    {
      base: "z",
      letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g,
    },
  ];

  for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
    str = str.replace(
      defaultDiacriticsRemovalMap[i].letters,
      defaultDiacriticsRemovalMap[i].base
    );
  }

  return str;
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
  let dformat =
    d.getFullYear() +
    "/" +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + d.getDate()).slice(-2);
  return dformat;
}

function orderSelect(select) {
  $(select).html(
    $(select + " option").sort(function (a, b) {
      return removeDiacritics(a.text) == removeDiacritics(b.text) ?
        0 :
        removeDiacritics(a.text) < removeDiacritics(b.text) ?
        -1 :
        1;
    })
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

window.Clipboard = (function (window, document, navigator) {
  var textArea, copy;

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text) {
    textArea = document.createElement("textArea");
    textArea.value = text;
    document.body.appendChild(textArea);
  }

  function selectText() {
    var range, selection;

    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
  }

  function copyToClipboard() {
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  copy = function (text) {
    createTextArea(text);
    selectText();
    copyToClipboard();
  };

  return {
    copy: copy,
  };
})(window, document, navigator);