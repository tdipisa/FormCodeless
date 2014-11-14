
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
	 * @cfg {String} newFieldSetTitle
	 * Testo del field set in modalità di nuovo elemento.
	 */
	newFieldSetTitle: "Nuovo Elemento",
	
	/**
	 * @property {TolomeoExt.ToloCodelessManager} codelessManager
	 * Gestore delle operazioni del componente.
	 */
	
	/**
	 * @property {Ext.grid.Panel} propertyGrid
	 * Griglia ExtJs per la presentazione e la modifica dei dati richiesti.
	 */
	
	/**
	 * @property {String} mode
	 * Stringa che indica la modalità di funzionamento corrente della form.
	 */

	/**
     * Inizializza un nuovo TolomeoExt.ToloCodeLessPanel.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		var gridStore = Ext.create('Ext.data.Store', {
		    fields: ["name", "value"],
		    proxy: {
		        type: 'memory',
		        reader: {
		            type: 'json',
		            root: 'rows'
		        }
		    }
		});
		
	    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	    	clicksToEdit : 1,
	        autoCancel: false
	    });
	    
		this.propertyGrid = Ext.create('Ext.grid.Panel', {
			margin: "5 0 5 0",
			hideHeaders: true,
			store: gridStore,
		    columns: [
              {
            	  header: 'Nome',  
            	  dataIndex: 'name', 
            	  flex: 50/100
              },              {
            	  header: 'NL',  
            	  dataIndex: 'nl',
                  hidden: true
              },
              {
            	  header: 'Tipo',  
            	  dataIndex: 'type',
                  hidden: true
              },
              {
            	  header: 'Editabile',  
            	  dataIndex: 'editable',
                  hidden: true
              },
              {
            	  header: 'Validation',  
            	  dataIndex: 'validation',
                  hidden: true
              }, 
              {
            	  header: 'Valore', 
            	  dataIndex: 'value', 
            	  flex: 50/100,
            	  getEditor: function(record) {
            		  	var editable = record.get("editable");
            		  	if(editable){
                		    var type = record.get("type");
                		    
                		    // ///////////////////////////////////////////////////////
                		    // Set the field's validation rules using the retrieved 
                		    // Regular Expression if any.
                		    // ///////////////////////////////////////////////////////
                		    var validation = record.get("validation");
                		    var baseConfig = {};
                		    if(validation != "undefined"){
                		    	var valueTest = new RegExp(validation);
                		    	baseConfig = {
    	                            validator: function(value) {
    	                                return valueTest.test(value) ? true : "Valore campo non valido";
    	                            }
    	                		}
                		    }
                		    
    	  	                switch (type) {
    		                    case "java.util.Date":
    		                    case "java.util.Calendar":
    		                		var config = Ext.apply({
		            		            allowBlank: false,
		            		        }, baseConfig);
    		                		
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Date', config)
    		            		    });
    		                        break;
    		                    case "java.lang.Boolean":
    		                		var config = Ext.apply({
		            		            allowBlank: false,
		            		        }, baseConfig);
    		                		
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Checkbox', config)
    		            		    });
    		                        break;
    		                    case "java.lang.String":
    		                		var config = Ext.apply({
		            		            allowBlank: false,
		            		        }, baseConfig);
    		                		
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Text', config)
    		            		    });
    		                        break;
    		                    default:
    		                		var config = Ext.apply({
		            		            allowBlank: false,
		            		        }, baseConfig);
    		                    
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Number', config)
    		            		    });
    		                }
            		  	}
            	  }
              }
            ],
            plugins: [cellEditing],
			listeners: {
				scope: this,
				edit: function(grid, cell){
					this.setBtnStatus(true);
				}
			}
		});
		
		this.fieldSet = Ext.create('Ext.form.FieldSet', {
			title: "",
			border: 0,
			anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			hidden: true,
			items:[this.propertyGrid]
		});
		
		this.formPanel = Ext.create('Ext.form.Panel', {
		    border: 0,	
		    cls: "tolomeo-formcodelessbbar",
		    layout: 'anchor',
		    hidden: true,
		    defaults: {
		        anchor: '100%'
		    },
		    items: [
	            this.fieldSet
		    ],
		    buttons: [{
		    	xtype: "button", 
		    	minWidth: '20',
		    	ref: "resetButton",
		    	tooltip: "Reimposta Campi",
		    	iconCls: "reset",
		    	disabled: true,
		    	hidden: true,
		    	scope: this,
		    	handler: function(button){
		    		Ext.MessageBox.confirm(
	    				'Ripristino', 
	    				'Procedere con il ripristoni dei dati allo stato iniziale?', 
	    				function(btn){
		    			   if(btn === 'yes'){
		    				   this.codelessManager.restore();
		    			   }
	    				}, 
	    				this
    				);
		    	}
		    },{
		    	xtype: "button", 
		    	minWidth: '20',
		    	ref: "saveButton",
		    	tooltip: "Applica Modifiche",
		    	iconCls: "save",
		    	disabled: true,
		    	hidden: true,
		    	scope: this,
		    	handler: function(button){
		    		
		    		// //////////////////////////////////
		    		// TODO: here the validity check!
		    		// //////////////////////////////////
		    		
		    		Ext.MessageBox.confirm(
	    				'Salvataggio', 
	    				'Procedere con il salvataggio?', 
	    				function(btn){
		    			   if(btn === 'yes'){
//		    				   var store = this.propertyGrid.getStore();
//		    				   var record = store.findRecord("nl", "NL_IDTPN");
		    				   
		    				   if(this.mode == "new"){
		    					   this.codelessManager.create();
		    				   }else{
		    					   this.codelessManager.update();
		    				   }
		    			   }
	    				}, 
	    				this
    				);
		    	}
		    }]
		});
		
		this.callParent();
		this.buildManager(gridStore);
		
		this.add([this.formPanel]);
	},
	
	/**
     * Crea il Gestore delle richieste se assente e registra gli eventi necessari.
     * @param {Ext.Data.Store} store Store che il Manager deve gestire.
     */
	buildManager: function(store){
		this.codelessManager = Ext.create('TolomeoExt.ToloCodelessManager', {
			TOLOMEOServer : this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext,
			store: store
		});
		
		this.codelessManager.on({
			changemode: function(mode, store){
				this.setFormMode(mode, store);
			},
			objectselected: function(){
				this.hideForm();
			},
			restore: function(){
				this.setBtnStatus(false);
			},
			updatedata: function(){
				this.setBtnStatus(false);
			},
			createdata: function(){
				this.setBtnStatus(false);
			},
			deletedata: function(){
				this.setBtnStatus(false);
				this.setBtnVisibility(false);
				this.hideForm();
			},
			scope: this
		});
	},
	
	/**
     * Imposta sul Manager l'oggetto di controllo della mappa per intercettare le 
     * operazioni utente (eventi tolomeo) e procedere con la gestione della form.
     * @param {TolomeoExt.ToloMapAPIExt} mapApiExt Oggetto di controllo della mappa.
     */
	setMapApiExt: function(mapApiExt){
		this.codelessManager.setMapApiExt(mapApiExt);
	},
	
	/**
     * Imposta la modalità con cui configurare la form.
     * @param {String} mode Modalità di configurazione (view, edit, new).
     * @param {Ext.Data.Store} store Store con gui configurare la griglia dei dati
     */
	setFormMode: function(mode, store){
		this.mode = mode;
		
		if(mode == "view"){
			this.fieldSet.setTitle(this.viewFieldSetTitle);	
			this.setBtnVisibility(false);
		}else if(mode == "edit"){
			this.fieldSet.setTitle(this.editFieldSetTitle);
			this.setBtnVisibility(true);
		}if(mode == "new"){
			this.fieldSet.setTitle(this.newFieldSetTitle);
			this.setBtnVisibility(true);
		}
		
		this.showForm();
		this.propertyGrid.reconfigure(store);
	},
	
	/**
     * Visualizza la form dei dati.
     */
	showForm: function(){
		this.fieldSet.show();
		this.formPanel.show();
	},
	
	/**
     * Nasconde la form dei dati.
     */
	hideForm: function(){
		this.fieldSet.hide();
		this.formPanel.hide();
	},
	
	/**
     * Imposta lo stato dei pulsanti presenti nella toolbar del pannello di modifica.
     */
	setBtnStatus: function(enabled){
		if(enabled === true){
			this.formPanel.query("button[ref=resetButton]")[0].enable();
			this.formPanel.query("button[ref=saveButton]")[0].enable();
		}else{
			this.formPanel.query("button[ref=resetButton]")[0].disable();
			this.formPanel.query("button[ref=saveButton]")[0].disable();
		}
	},
	
	/**
     * Imposta la visibilità dei pulsanti presenti nella toolbar del pannello di modifica.
     */
	setBtnVisibility: function(visible){
		if(visible === true){
			this.formPanel.query("button[ref=saveButton]")[0].show();
			this.formPanel.query("button[ref=resetButton]")[0].show();
		}else{
			this.formPanel.query("button[ref=saveButton]")[0].hide();
			this.formPanel.query("button[ref=resetButton]")[0].hide();
		}
	}
    
});
