
/**
 * Plugin per la gestione di richieste e operazioni 
 * che coinvolgono la form codeless.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.ToloCodelessRequestManager', {
	
	extend: 'Ext.util.Observable',
	
	id: "cl_requestmanager",
	
	/**
	 * @cfg {String} TOLOMEOServer
	 * URL di base del contesto di Tolomeo.
	 */
	TOLOMEOServer: null,
	
	/**
	 * @cfg {String} TOLOMEOContext
	 * Contesto di Tolomeo.
	 */
	TOLOMEOContext: null,

	/**
     * Crea un nuovo TolomeoExt.ToloCodelessRequestManager.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor: function(config) {
		this.callParent(arguments);
		
		Ext.apply(this, config);
		
		this.addEvents(
	        /**
			 * @event
			 * Lanciato alla fallimento della richiesta.
			 */
			"loaddatafailure",
	        /**
			 * @event
			 * Lanciato prima di effettuare la richiesta di caricamento dati.
			 */
			"beforeloaddata",
	        /**
			 * @event
			 * Lanciato al termine della richiesta se questa è andata a buon fine.
			 */
			"loaddata"
		);	
	},
	
	/**
     * Handler invocato in caso di fallimento della richiesta Ajax.
     * @param {Ext.Data.Store} store Oggetto rappresentante lo store dei dati. 
     *
     */
	doAjaxFailure: function (store) {
		this.fireEvent("loaddatafailure", store);
    },
    
    /**
     * Metodo di caricamento dello store delle features.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
    loadEditMode: function(fparams){       	
    	this.fireEvent("beforeloaddata");
    	
    	var submitOpt = {
    		url: this.TOLOMEOServer + this.TOLOMEOContext + '/LayerItemServlet',
    		method: 'POST',
    		params: fparams,
    		waitMsg: 'Ricerca in corso...',
    		success: function(results, store){
    			this.fireEvent("loaddata", store);
    		},
    		failure: this.doAjaxFailure,
    		scope: this
    	};
    	
		new TolomeoExt.ToloCrossAjax().request(submitOpt);
    }
	
});