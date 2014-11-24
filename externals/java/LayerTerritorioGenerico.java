package it.prato.comune.sit;

import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.opengis.feature.simple.SimpleFeature;

public class LayerTerritorioGenerico extends LayerTerritorio {

    private String 				configPrefix = null;
	private int    				defaultCodTPN;
	private int    				tipoLayer = LAYER_OF_POLYGONS;
	//private String 				espressioneNomeOggetto = null;
	//private String 				espressioneDescrizione = null;
	//private List<String> 		espressioneDescrizioneSuggest = null;
	
	private Map<String, String> elencoCampi = null;
	private Map<String, String> elencoCampiLeggibili = null;
	private Map<String, String> elencoCampiRegEx = null;
	private Map<String, String> elencoCampiReadWrite = null;
	private Map<String, String> elencoCampiDefaultValues = null;
	
	private Map<String, String> elencoAttributiFk = null;
	
	private Map<String, String> campoDateFormat = null;

	private List<IRicerca> 		listaRicerche = null; 
	private boolean 			bElencoCampiInizializzato = false;
    
    /**
     * Costruttore di default della classe LayerCircoscrizioni.
     */
    public LayerTerritorioGenerico(int codTPN, String nome, LogInterface logger ) {
        super();        
        setCodTPN(codTPN);
        this.configBean = new ConfigBean();
        setNome(nome);
        this.logger = logger;
            
    }
    
    public String getConfigPrefix() { return configPrefix;  };
    public void setConfigPrefix(String configPrefix) { this.configPrefix = configPrefix; } 
    
    public void setElencoCampi(Map<String, String> elencoCampi) { 
    	this.elencoCampi = elencoCampi;
    }
    
    /**
	 * @param elencoCampiLeggibili the elencoCampiLeggibili to set
	 */
	public void setElencoCampiLeggibili(Map<String, String> elencoCampiLeggibili) {
		this.elencoCampiLeggibili = elencoCampiLeggibili;
	}

	/**
	 * @param elencoCampiRegEx the elencoCampiRegEx to set
	 */
	public void setElencoCampiRegEx(Map<String, String> elencoCampiRegEx) {
		this.elencoCampiRegEx = elencoCampiRegEx;
	}
	
	/**
	 * @param elencoCampiReadWrite the elencoCampiReadWrite to set
	 */
	public void setElencoCampiReadWrite(Map<String, String> elencoCampiReadWrite) {
		this.elencoCampiReadWrite = elencoCampiReadWrite;
	}
	
	/**
	 * @param defaultAttributeValues the defaultAttributeValues to set
	 */
	public void setElencoCampiDefaultValues(Map<String, String> elencoCampiDefaultValues) {
		this.elencoCampiDefaultValues = elencoCampiDefaultValues;
	}
	
	/**
	 * @param elencoAttributiFk the elencoAttributiFk to set
	 */
	public void setElencoAttributiFk(Map<String, String> elencoAttributiFk) {
		this.elencoAttributiFk = elencoAttributiFk;
	}

	/**
	 * @param dateFormat the dateFormat to set
	 */
	public void setCampoDateFormat(Map<String, String> campoDateFormat) {
		this.campoDateFormat = campoDateFormat;
	}

	public void setLayerConfig(ConfigLayerBean layerConfig) {
        configBean.setLayerConfig(layerConfig);
    }
    
    // TODO vedere se spostare altrove
    public void setDSPool(SITDataStorePool dsPool) {
    	configBean.setDsPool(dsPool);
    	// TODO messo qua perchè deve essere fatto quando è noto dspoolid ma posizionare meglio
    	elabElencoCampi();
    }

    /**
     * Elabora i nomi campi inserendoli. Occorre che venga eseguita una volta sola quando sia DSPool che elencoCampi sono inizializzati
     */
    private void elabElencoCampi() {
    	 if (elencoCampi!=null && configBean.getDsPool()!=null && !bElencoCampiInizializzato) {
         	addnomicampi(Layers.NL_IDTPN, elencoCampi.get(Layers.NL_IDTPN));
         	for (String nl: elencoCampi.keySet()) {
         		addnomicampi(nl, elencoCampi.get(nl)); 
         	}
         	
         	for (String hr: elencoCampiLeggibili.keySet()) {
         		addnomicampiLeggibili(null, null, null, hr, elencoCampiLeggibili.get(hr)); 
         	}
         	
         	for (String re: elencoCampiRegEx.keySet()) {
         		addnomicampiRegEx(null, null, null, re, elencoCampiRegEx.get(re));
         	}
         	
         	for (String rw: elencoCampiReadWrite.keySet()) {
         		addnomicampiReadWrite(null, null, null, rw, elencoCampiReadWrite.get(rw));
         	}
         	
         	for (String dv: elencoCampiDefaultValues.keySet()) {
         		addDefaultValueForField(null, null, null, dv, elencoCampiDefaultValues.get(dv));
         	}
         	
         	for (String fk: elencoAttributiFk.keySet()) {
         		addnomicampiFk(null, null, null, fk, elencoAttributiFk.get(fk));
         	}
         	
         	for (String df: campoDateFormat.keySet()) {
         		addnomicampiDateFormat(null, null, null, df, campoDateFormat.get(df));
         	}
         	
         	bElencoCampiInizializzato = true;
         }
    }
    
    public void setLayersManager(SITLayersManager layersManager) {
    	configBean.setLayersManager(layersManager);
    }
    
    /* 
     * @see it.prato.comune.sit.LayerTerritorio#initRicerche()
     */
    @Override
    protected void initRicerche() throws SITException  {
        //addRicerca(1, "Circoscrizione", "cercaCircoscrizione",new Class[]{String.class}, "Nome Circoscrizione");
    	
        if ( listaRicerche != null) {
        	int i=1;
        	for (IRicerca ric: listaRicerche) {
        		ric.setLogger(logger);
        		ric.addRicerca(i, this);
        		i++;
        	}
        }
        
        super.initRicerche();
    };
    
    @Override
    public ArrayList<OggettoTerritorio> cerca(Integer id, Object...args) throws SITException {
    	if ( getRicerche().get(id).getMetodo()==null) {
    		IRicerca ric = listaRicerche.get(id-1);
    		return ric.cerca(args);
    	} else {
    		return super.cerca(id, args);
    	}
    }

	/*
     * @see it.prato.comune.sit.LayerTerritorio#initNomiCampi(java.util.Properties, java.lang.String, java.lang.String)
     */
    @Override
    protected void initNomiCampi(Properties pr, String ente, String nomeLayer) {        
    
 /*       addnomicampi(pr,ente,nomeLayer, Layers.NL_IDTPN);
        
        if (elencoNLCampi!=null) {
        	for (String nl: elencoNLCampi) addnomicampi(pr,ente,nomeLayer, nl); 
        }
*/       
     }

    /*
     * @see it.prato.comune.sit.LayerTerritorio#creaOggetto(org.opengis.feature.simple.SimpleFeature)
     */
    protected OggettoTerritorio creaOggetto(SimpleFeature curFeat){
        return new OggettoTerritorioGenerico(logger, this, curFeat);    
    }
	/**
	 * @return the defaultCodTPN
	 */
	public int getDefaultCodTPN() {
		return defaultCodTPN;
	}
    

	/**
	 * @return the listaRicerche
	 */
	public List<IRicerca> getListaRicerche() {
		return listaRicerche;
	}

	/**
	 * @param listaRicerche the listaRicerche to set
	 * @throws SITException 
	 */
	public void setListaRicerche(List<IRicerca> listaRicerche) throws SITException {
		this.listaRicerche = listaRicerche;
		try {
			initRicerche();
		} catch (SITException e) {
			logger.error("Errore inizializzando le ricerche del layer codTPN=" + getDefaultCodTPN() + " " + getNome() ,  e);
			throw e;
		}
	}

	@Override
	public int getContentTypeLayer() {
		return tipoLayer;
	}

	/**
	 * @return the tipoLayer
	 */
	public int getTipoLayer() {
		return tipoLayer;
	}

	/**
	 * @param tipoLayer the tipoLayer to set
	 */
	public void setTipoLayer(int tipoLayer) {
		this.tipoLayer = tipoLayer;
	}

	/* (non-Javadoc)
	 * @see it.prato.comune.sit.LayerTerritorio#ricercaSuggest2(int, int, boolean, java.lang.Object[])
	 */
	@Override
	public JSGeometryArrayList<? extends JSGeometry> ricercaSuggest2(
			int idRicerca, int nCampo, boolean withGeometry, Object... valori)
			throws SITException {
		
		return listaRicerche.get(idRicerca-1).ricercaSuggest2( nCampo, withGeometry, valori);
	}

	
    /*
     * Ricerca una corcoscrizione.
     * 
     * @param Circ
     * @return PoligonoCircoscrizione
     */
    /*public PoligonoCircoscrizione cercaCircoscrizione (String Circ) {
        
        ArrayList<String> valore = new ArrayList<String>();
        ArrayList<String> campi = new ArrayList<String>();
        
        campi.add(NL_CIRC);
        
        valore.add(Circ);
        
        return (PoligonoCircoscrizione) super.cercaPoligono(campi, valore);        
    }*/
    
    /*
     * Ricerca una circoscrizione per codice.
     * 
     * @param cod
     * @return PoligonoCircoscrizione
     */
   /* public PoligonoCircoscrizione cercaCircoscrizionebyCod (String cod) {
       
       ArrayList<String> valore = new ArrayList<String>();
       ArrayList<String> campi = new ArrayList<String>();
       
       campi.add(NL_COD);
       
       valore.add(cod);
       
       return (PoligonoCircoscrizione) super.cercaPoligono(campi, valore);        
   }*/
    
}
