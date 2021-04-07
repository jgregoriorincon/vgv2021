// componentes de mapas
var map;
var view;
var zoomInicial = 4.5;
var centerInicial = [-74, 4];

// Widgets
var expandWidgets = [];
var swipeMapa;
var layerListWigdet;
var LegendExpand;
var printTask;

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

// Simbologia
var schemeLayer = [];
var legendWidget;
var sliderSimbology;

// Layer de dibujo y medicion
var layerGraphicsTemp;
var measureDistance, measureArea, measurePoint;

// Nombre labels
var tLayerBaseLabelsId = "Base_Labels";
var categoriaBaseOcultos = "0";

// URLs base
var URL_base = "https://vgv.unidadvictimas.gov.co";
var URL_server = URL_base + "/server/rest/services";
var URL_proxy = URL_base + "/DotNet/proxy.ashx";

// Impresion
var URL_Print_Services = URL_server + "/GP_UARIV/Imprimir/GPServer/Export%20Web%20Map";
var vgv_lstImpresion = [{
    nombre: "MAP_ONLY",
    titulo: "Solo mapa"
  },
  {
    nombre: "A4_Horizontal_Abajo",
    titulo: "A4 Horizontal (Leyenda Abajo)"
  },
  {
    nombre: "A4_Horizontal_Derecha",
    titulo: "A4 Horizontal (Leyenda a la Derecha)",
  },
  {
    nombre: "A4_Vertical_Abajo",
    titulo: "A4 Vertical (Leyenda Abajo)"
  },
  {
    nombre: "A3_Horizontal_Abajo",
    titulo: "A3 Horizontal (Leyenda Abajo)"
  },
  {
    nombre: "A3_Horizontal_Derecha",
    titulo: "A3 Horizontal (Leyenda a la Derecha)",
  },
  {
    nombre: "A3_Vertical_Abajo",
    titulo: "A3 Vertical (Leyenda Abajo)"
  },
];

// Servicios RUV
var URL_RUV = URL_server + "/RUV/RUV/MapServer";
var URL_RUV_DATOS = URL_RUV + "/3";
var URL_RUV_FECHACORTE = URL_RUV + "/4";

// Datos a procesar
var URL_DT_Services = "./files/data/data_DTC.json";
var URL_HechosBuscar_Services = "./files/data/data";

// Nombres capas geográficas
var nameLayerDepartamentos = "Base_Departamentos";
var nameLayerMunicipios = "Base_Municipios";
var nameLayerDT = "Base_DT";
var nameLayerPDET = "Base_PDET";

// Variables VGV
var vgv_compress_Hechos = [];
var vgv_resultados_Hechos = [];
var vgv_filter_Hechos = [];
var vgv_group_Hechos = [];
var vgv_graphic_hechos = [];

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
var vgv_lstEnfoque = ["SEXO", "DISCAPACIDAD", "ETNIA", "CICLO_VITAL"];
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
var strSQL_Mpios = 'SELECT G.OBJECTID,G.DPTO_CCDGO,G.DPTO_CNMBR,G.DT_CCDGO,G.DT_CNMBR,G.PDET_CCDGO,G.PDET_CNMBR,G.MPIO_CCDGO,G.MPIO_CNMBR, D.VALOR, G.SHAPE ';
var tableDef_Mpios = [{
    field: "DPTO_CCDGO",
    title: "Código DANE",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Código DANE",
    width: 150,
  },
  {
    field: "DPTO_CNMBR",
    title: "Departamento",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Departamento",
    width: 250,
  },
  {
    field: "DT_CCDGO",
    title: "Código Dirección Territorial",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Código DT",
    width: 150,
  },
  {
    field: "DT_CNMBR",
    title: "Dirección Territorial",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Dirección Territorial",
    width: 250,
  },
  {
    field: "PDET_CCDGO",
    title: "Código PDET",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Código PDET",
    width: 150,
  },
  {
    field: "PDET_CNMBR",
    title: "PDET",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar PDET",
    width: 300,
  },
  {
    field: "MPIO_CCDGO",
    title: "Código DANE",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Código DANE",
    width: 150,
  },
  {
    field: "MPIO_CNMBR",
    title: "Municipio",
    sorter: "string",
    visible: true,
    headerFilter: "input",
    headerFilterPlaceholder: "Buscar Municipio",
    width: 250,
  },
  {
    field: "VGV_NVALOR",
    title: "VGV_NVALOR",
    sorter: "number",
    visible: true,
    width: 150,
  },
  {
    field: "OBJECTID",
    visible: true,
    width: 50,
  },
];

// Tabla Departamentos
var strSQL_Dptos = 'SELECT G.OBJECTID,G.DPTO_CCDGO,G.DPTO_NCDGO,G.DPTO_CNMBR, D.VALOR, G.SHAPE ';
var tableDef_Dptos = [{
    field: "OBJECTID",
    visible: false,
  },
  {
    field: "DPTO_CCDGO",
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
var strSQL_DT = 'SELECT G.OBJECTID,G.DT_CCDGO,G.DT_NCDGO,G.DT_CNMBR, D.VALOR, G.SHAPE ';
var tableDef_DT = [{
    field: "OBJECTID",
    visible: false,
  },
  {
    field: "DT_CCDGO",
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
var strSQL_PDET = 'SELECT G.OBJECTID,G.PDET_CCDGO,G.PDET_NCDGO,G.PDET_CNMBR, D.VALOR, G.SHAPE ';
var tableDef_PDET = [{
    field: "OBJECTID",
    visible: false,
  },
  {
    field: "PDET_CCDGO",
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