package it.prato.comune.sit.plugin.demo.states;

import it.prato.comune.sit.ConfigBean;
import it.prato.comune.sit.ILayersManager;
import it.prato.comune.sit.LayerPoligoniTerritorio;
import it.prato.comune.sit.Layers;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import org.opengis.feature.simple.SimpleFeature;

/**
 * Classe demo LayerContinent.
 * 
 * @author Tobia Di Pisa
 *
 */
public class LayerContinents extends LayerPoligoniTerritorio {

    public final static int defaultCodTPN = 2;
    
    public static final String NL_CONTINENTNAME = "NL_CONTINENTNAME";
    
    public String getConfigPrefix() {  
    	return "CONTINENTS";  
    };

    /**
     * @param ter
     * @return LayerStates
     */
    static public LayerContinents getInstance(ILayersManager ter) {
       return (LayerContinents) ter.getLayerByCodTPN(defaultCodTPN);
    }
    
    /**
     * Costruttore della classe LayerStates.
     * 
     * @param configFilePath
     * @param logger
     * @param configBean
     * @param nome
     * @param codTPN
     * @param layer
     * @param nomiCampi
     */
    public LayerContinents(String configFilePath,
            LogInterface logger, ConfigBean configBean, String nome, int codTPN, int layer,
            HashMap<String, String> nomiCampi) {
        super(configFilePath, logger, configBean, nome, codTPN, layer, nomiCampi);
    }
    
    /**
     * Costruttore di default della classe LayerStates.
     */   
    public LayerContinents() {
        super();
    }

    /* 
     * @see it.prato.comune.sit.LayerTerritorio#creaOggetto(org.opengis.feature.simple.SimpleFeature)
     */
    protected OggettoTerritorio creaOggetto(SimpleFeature curFeat) {
        return new PoligonoState(logger, this, curFeat); 
    }

    /* 
     * @see it.prato.comune.sit.LayerTerritorio#initNomiCampi(java.util.Properties, java.lang.String, java.lang.String)
     */
    protected void initNomiCampi(Properties pr, String ente, String nomeLayer) {
        addnomicampi(pr, ente, nomeLayer, Layers.NL_IDTPN);
        addnomicampi(pr, ente, nomeLayer, NL_CONTINENTNAME);
    }

	/* 
     * @see it.prato.comune.sit.LayerTerritorio#initRicerche()
     */
    @Override
    protected void initRicerche() throws SITException  {
    	addRicerca(1, "Per nome", "findContinent", new Class[]{String.class}, "Nome continente");
    };

    /**
     * Trova uno stato per nome
     * @param nome
     * @return
     */
	@SuppressWarnings("unchecked")
	public List<PoligonoContinent> findContinent(String name) {
        
        ArrayList<String> valore = new ArrayList<String>();
        ArrayList<String> campi = new ArrayList<String>();
        
        campi.add(NL_CONTINENTNAME);
        
        valore.add(name);
        
        return (List<PoligonoContinent>) super.cercaPoligoniLike(campi, valore);        
    }
}