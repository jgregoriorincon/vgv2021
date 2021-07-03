// Variables globales ESRI
var _esriConfig, _Map, _Basemap, _MapView, _Graphic;
var _Collection, _watchUtils;
var _FeatureLayer, _GeoJSONLayer, _GraphicsLayer, _MapImageLayer;
var _QueryTask, _Query;
var _Color, _colorRendererCreator;
var _webMercatorUtils, _SpatialReference, _Point;
var _Home, _Zoom, _Compass, _Locate, _Track, _Search, _Legend, _BasemapGallery, _LocalBasemapsSource, _ScaleBar, _Attribution, _LayerList, _Expand, _Swipe, _Slider;
var _Sketch, _SketchViewModel, _DistanceMeasurement2D, _AreaMeasurement2D, _CoordinateConversion, _FormatCoordinate, _ConversionCoordinate;
var _PrintTask, _PrintTemplate, _PrintParameters;
var _CalciteMaps, _CalciteMapArcGISSupport;
var _Collapse, _Dropdown, _Tab;

var IdCSV = 100000;

// componentes de mapas
var map;
var view;
var home;
var initialExtent = {
  "type": "extent",
  "spatialReference": {
    "latestWkid": 3857,
    "wkid": 102100
  },
  "xmin": -9605046.96521345,
  "ymin": -512072.09152068413,
  "xmax": -6913392.128351059,
  "ymax": 1481222.7193910647
};

// Widgets
var expandWidgets = [];
var swipeMapa;
var layerListWigdet;
var legendWidget;
var LegendExpand;

// z-index base
var current_Zindex = 4100;

// loading
var loading;

// Variables de configuración de layers
var current_reportes = [];
var config_layers = [];
var base_layers = [];
var current_layers = [];
var consulta_layers = [];

// Layer de dibujo y medicion
var layerGraphicsTemp;
var measureDistance, measureArea, measurePoint;

// Nombre labels
var tLayerBaseLabelsId = "Base_Labels";
var categoriaBaseOcultos = "0";

// URLs base
var URL_BASE = "https://vgv.unidadvictimas.gov.co";
var URL_SERVER = URL_BASE + "/server/rest/services";
var URL_PROXY = URL_BASE + "/DotNet/proxy.ashx";

// Impresion
var printTask;
// var URL_Print_Services = URL_SERVER + "/GP_UARIV/Imprimir/GPServer/Export%20Web%20Map";
var URL_Print_Services = URL_SERVER + "/GP_UARIV/PrintTest/GPServer/Export%20Web%20Map";
// var vgv_lstImpresion = [{
//     nombre: "MAP_ONLY",
//     titulo: "Solo mapa"
//   },
//   {
//     nombre: "A4_Horizontal_Abajo",
//     titulo: "A4 Horizontal (Leyenda Abajo)"
//   },
//   {
//     nombre: "A4_Horizontal_Derecha",
//     titulo: "A4 Horizontal (Leyenda a la Derecha)",
//   },
//   {
//     nombre: "A4_Vertical_Abajo",
//     titulo: "A4 Vertical (Leyenda Abajo)"
//   },
//   {
//     nombre: "A3_Horizontal_Abajo",
//     titulo: "A3 Horizontal (Leyenda Abajo)"
//   },
//   {
//     nombre: "A3_Horizontal_Derecha",
//     titulo: "A3 Horizontal (Leyenda a la Derecha)",
//   },
//   {
//     nombre: "A3_Vertical_Abajo",
//     titulo: "A3 Vertical (Leyenda Abajo)"
//   },
// ];
var vgv_lstImpresion = [{
    nombre: "MAP_ONLY",
    titulo: "Solo mapa"
  },
  {
    nombre: "A4_VerticalAbajo",
    titulo: "A4 Vertical (Leyenda Abajo)"
  },
];

// Servicios RUV
var URL_RUV = URL_SERVER + "/RUV/RUV/MapServer";
var URL_RUV_DATOS = URL_RUV + "/3";
var URL_RUV_FECHACORTE = URL_RUV + "/4";
var VGV_TABLA_DATOS;
var vgv_graphic_hechos;

// Datos a procesar
var URL_DT_Services = "./files/data/data_DTC.json";

// Nombres capas geográficas
var nameLayerDepartamentos = "Base_Departamentos";
var nameLayerMunicipios = "Base_Municipios";
var nameLayerDT = "Base_DT";
var nameLayerPDET = "Base_PDET";

// Variables listados
var vgv_lstDepartamentos = [];
var vgv_lstDepartamentosDT = [];
var vgv_lstDepartamentosPDET = [];
var vgv_lstMunicipios = [];
var vgv_lstMunicipiosDT = [];
var vgv_lstMunicipiosPDET = [];
var vgv_lstDT = [];
var vgv_lstPDET = [];
var vgv_lstAnios = [];

// Listados base
var vgv_lstVariable = [{
  nombre: "EVENTOS",
  titulo: "Eventos"
}, {
  nombre: "DECLARACION",
  titulo: "Víctimas Declaración"
}, {
  nombre: "OCURRENCIA",
  titulo: "Víctimas Ocurrencia"
}];

var vgv_lstHechos;
var vgv_lstSexo;
var vgv_lstEtnia;
var vgv_lstDiscapacidad;
var vgv_lstCicloVital;

// Años a procesar
var vgv_inicioAnio = 1985;
var vgv_finAnio = new Date().getFullYear();
var FechaCorte;

// Expresion regular para encontrar un numero
var numberSearchPattern = /-?\d+[\.]?\d*/;

// Definición de Tablas
var tableFilterData;

// Tabla Municipios
var strSQL_Mpios = 'SELECT G.OBJECTID,G.MPIO_NCDGO,CONCAT(G.MPIO_CNMBR, \', \', G.DPTO_CNMBR) AS MPIO_CNMBR, D.VGV_NVALOR, G.SHAPE ';
var tableDef_Mpios = [{
    field: "OBJECTID",
    visible: false
  },
  {
    field: "MPIO_NCDGO",
    title: "Código DANE",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Código DANE"
  },
  {
    field: "MPIO_CNMBR",
    title: "Municipio, Departamento",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Municipio"
  },
  {
    field: "VGV_NVALOR",
    title: "VGV_NVALOR",
    sorter: "number",
    visible: true
  }
];

// Tabla Departamentos
var strSQL_Dptos = 'SELECT G.OBJECTID,G.DPTO_NCDGO,G.DPTO_CNMBR, D.VGV_NVALOR, G.SHAPE ';
var tableDef_Dptos = [{
    field: "OBJECTID",
    visible: false,
  },
  {
    field: "DPTO_NCDGO",
    title: "Código DANE",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Código DANE",
  },
  {
    field: "DPTO_CNMBR",
    title: "Departamento",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Departamento",
  },
  {
    field: "VGV_NVALOR",
    title: "VGV_NVALOR",
    sorter: "number",
    visible: true,
  },
];

// Tabla DT
var strSQL_DT = 'SELECT G.OBJECTID,G.DT_NCDGO,G.DT_CNMBR, D.VGV_NVALOR, G.SHAPE ';
var tableDef_DT = [{
    field: "OBJECTID",
    visible: false,
  },
  {
    field: "DT_NCDGO",
    title: "Código Dirección Territorial",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Código DT",
  },
  {
    field: "DT_CNMBR",
    title: "Dirección Territorial",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Dirección Territorial",
  },
  {
    field: "VGV_NVALOR",
    title: "VGV_NVALOR",
    sorter: "number",
    visible: true,
  },
];

// Tabla PDET
var strSQL_PDET = 'SELECT G.OBJECTID,G.PDET_NCDGO,G.PDET_CNMBR, D.VGV_NVALOR, G.SHAPE ';
var tableDef_PDET = [{
    field: "OBJECTID",
    visible: false,
  },
  {
    field: "PDET_NCDGO",
    title: "Código PDET",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Código PDET",
  },
  {
    field: "PDET_CNMBR",
    title: "PDET",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar PDET",
  },
  {
    field: "VGV_NVALOR",
    title: "VGV_NVALOR",
    sorter: "number",
    visible: true,
  },
];

// CSV
var dataLoadCSV = null;

// Time
var legendTime;
var velocidadTime = 1;
var sliderTime, sliderTimeRange;
var animation = null;
var playButton;
var idLayerTime;
var loopFull = false;

// Pako
let avancePako = 115000;