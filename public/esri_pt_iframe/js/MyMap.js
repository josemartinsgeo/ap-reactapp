define([
  "esri/map",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/dijit/Search",
  "esri/dijit/BasemapLayer",
  "esri/dijit/Basemap",
  "esri/dijit/BasemapGallery",
  "esri/geometry/Extent",
  "esri/tasks/ProjectParameters",
  "esri/tasks/GeometryService",
  "esript/DialogMessage",
  "esript/AppConfig",
  "dojo/dom",
  "dojo/on",
  "dojo/html",
  "dojo/query",
  "dojo"
], function (Map, ArcGISDynamicMapServiceLayer, Search, BasemapLayer, Basemap, BasemapGallery, Extent, ProjectParameters, GeometryService, DialogMessage, AppConfig, dom, on, html, query, dojo) {

  let _enableContent = (ids) => {
    ids.forEach(id => {
      dojo.removeClass(id, "disabledContent")
    });
  }

  let _disableContent = (ids) => {
    ids.forEach(id => {
      dojo.addClass(id, "disabledContent")
    });
  }

  let _showLoading = () => {
    _disableContent(elements);
    esri.show(loading);
    map.disableMapNavigation();
    map.hideZoomSlider();
  }

  let _hideLoading = (error) => {
    _enableContent(elements);
    esri.hide(loading);
    map.enableMapNavigation();
    map.showZoomSlider();
  }

  let loading = dom.byId("loadingImg");
  let elements = ["templateDiv", "search", "basemapGallery"];

  let map = new Map("map", {
    basemap: "satellite",
    center: {
      "x": -959492.6682373729,
      "y": 5036285.767262436,
      "spatialReference": {
        "wkid": 102100
      }
    },
    zoom: AppConfig._zoom._initialLevel,
    lods: AppConfig._zoom._lods,
    sliderStyle: "small"
  });

  var smaspcartoref = new ArcGISDynamicMapServiceLayer(AppConfig._mapConfig._basemap._url);
  var cartoref = new BasemapLayer({ url: AppConfig._mapConfig._basemap._url });
  var enderecamento = new BasemapLayer({ url: AppConfig._mapConfig._serviceLayers[0]._url });

  var basemap = new Basemap({
    layers:[cartoref, enderecamento],
    title: AppConfig._mapConfig._basemap._title,
    thumbnailUrl: AppConfig._mapConfig._basemap._thumbnail
  });

  var basemapGallery = new BasemapGallery({
    showArcGISBasemaps: true,
    map: map
  }, "basemapGallery");

  _disableContent(["selectBasemapGallery"]);
  basemapGallery.add(basemap);
  basemapGallery.select("basemap_0");
  basemapGallery.startup();

  basemapGallery.on("load", function (s) {
    basemapGallery.basemaps = basemapGallery.basemaps.filter(bm => bm.id === "basemap_0" || bm.id === "basemap_10")
    _enableContent(["selectBasemapGallery"]);
  });

  basemapGallery.on("error", function (msg) {
    console.log("basemap gallery error:  ", msg);
    DialogMessage.infoMessage('Erro', `não foi possível carregar a galeria de mapa base: ${msg.message}`)
  });

  var search = new Search({
    map: map,
    enableInfoWindow: false
  }, "search");
  search.startup();

  return {
    map: map,
    fullExtent : () => smaspcartoref.fullExtent,
    showLoading: () => _showLoading(),
    hideLoading: () => _hideLoading()
  }

});
