
/**
 * Strumento di visualizzazione ed editing dei dati configurabile, 
 * senza la necessità di scrivere codice (“codeless”) per Tolomeo. 
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.ToloCodeLessPanel', {

	extend: 'Ext.Panel',

	/**
	 * @cfg {Object} paramsJS
	 * Configurazioni specifiche del file di preset.
	 */
	paramsJS: null,

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
	 * @cfg {String} viewFieldSetTitle
	 * Testo del field set in modalità di visualizzazione.
	 */
	viewFieldSetTitle: "Visualizzazione Dati",
	
	/**
	 * @cfg {String} editFieldSetTitle
	 * Testo del field set in modalità di modifica.
	 */
	editFieldSetTitle: "Modifica Dati",
	
	/**
	 * @property {TolomeoExt.ToloMapAPIExt} mapApiExt
	 * Oggetto di controllo della mappa.
	 */
	
	/**
	 * @property {Boolean} editing
	 * Stabilisce se le form deve consentire la modifica.
	 */
	
	/**
     * Inizializza un nuovo TolomeoExt.ToloCodeLessPanel.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		this.propertyGrid = Ext.create('Ext.grid.property.Grid', {
			margin: "10 5 10 5",
			hideHeaders: true,
			listeners: {
				scope: this,
				beforeedit: function(grid, cell){
					if(!this.editing){
						return false;
					}
				}
			}
		});
		
		this.fieldSet = Ext.create('Ext.form.FieldSet', {
			title: "",
			anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			hidden: true,
			items:[this.propertyGrid]
		});
		
		this.callParent();
		
		this.add([this.fieldSet]);
	},
	
	/**
     * Imposta l'oggetto di controllo della mappa per intercettare l'evento di 
     * selezione dell'azione e procedere con il popolamaneto della form.
     * @param {TolomeoExt.ToloMapAPIExt} mapApiExt oggetto di controllo della mappa.
     */
	setMapApiExt: function(mapApiExt){
		this.mapApiExt = mapApiExt;
		this.mapApiExt.on({
			onEventActionAjaxSuccess: function(eventoLayer, tipoEvento, idBtn, nStep, records, store, oggetto){
				switch(tipoEvento){
					case 0: // Identify
						this.fieldSet.setTitle(this.viewFieldSetTitle);
						
						this.editing = false;
						this.fieldSet.show();
						this.propertyGrid.setSource(records[0].data);
						break;
					case 1: // Delete
						break;
					case 3: // Edit
						this.fieldSet.setTitle(this.editFieldSetTitle);
						
						this.editing = true;
						this.fieldSet.show();
						this.propertyGrid.setSource(records[0].data);
						break;
					case 4: // New
						break;
				}
			},
			onObjectSelect: function(){
				this.fieldSet.hide();
			},
			scope: this
		});
	}
    
});
