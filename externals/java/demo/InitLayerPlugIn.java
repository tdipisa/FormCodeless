package it.prato.comune.sit.plugin.demo;

import it.prato.comune.sit.IInitLayerPlugin;
import it.prato.comune.sit.ILayersManager;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.plugin.demo.runtime.PluginVersion;
import it.prato.comune.sit.plugin.demo.states.LayerContinents;
import it.prato.comune.sit.plugin.demo.states.LayerStates;

import java.util.Properties;

/**
 * Classe di inizializzazione plugin di layer.</br>
 * Il package SIT prevede, dalla versione 2.0, la separazione delle funzionalità "core" dalla definizione dei layer, che sono definiti separatemente e che risiedono su JAR separati<br/>
 * <br>
 * Ogni plugin di layer deve: 
 * <ul>
 * <li>contenere una classe come la presente, contenete un metodo statico static public void init(Properties pr, Territorio ter) throws MalformedURLException, SITException all'interno del quale
 * vengono inizializzati i layer tramite chiamate alla ter.initLayers(...). Tipicamente il contenuto del metodo sarà di questo tipo: <br/><pre>
 * static public void init(Properties pr, Territorio ter) throws MalformedURLException, SITException{
    
        ter.initLayers(pr,  LayerCircoscrizioni.defaultCodTPN, new LayerCircoscrizioni());
            
        ter.initLayers(pr, LayerSinistri.SottoTipo.Sinistri2008.getCodTPN(), new LayerSinistri(LayerSinistri.SottoTipo.Sinistri2008.getCodTPN()));
        ter.initLayers(pr, LayerSinistri.SottoTipo.Sinistri2009.getCodTPN(), new LayerSinistri(LayerSinistri.SottoTipo.Sinistri2009.getCodTPN()));
        ter.initLayers(pr, LayerSinistri.SottoTipo.Sinistri2010.getCodTPN(), new LayerSinistri(LayerSinistri.SottoTipo.Sinistri2010.getCodTPN()));
   }</pre></li>
 * <li>nel file di configurazione Config.txt devono essere presenti 1 o più righe per caricare i plugin in uso (es. 001PLUGIN1=it.prato.comune.sit.InitLayerPlugIn)</li>
 * <li>le classi che implementano i layer devono contenere un metodo statico  come il seguente per ottenere l'istanza <pre>
 *     static public LayerFarmacie getInstance(ISITLayersManager ter) {
           return (LayerFarmacie) ter.getLayerByCodTPN(defaultCodTPN);
       }   </pre><br>
       ed uno come il seguente per definire il prefisso delle configurazioni all'interno di Config.txt<br/><pre>
       public String getConfigPrefix( ) {  return "FARMACIE";  };
       </pre></li>
 * </ul>
 * I layer così definiti sono utilizzabili tramite una istanza della classe territorio secondo una delle due seguenti modalità
 * <ul>
 * <li> recupero dell'istanza tramite il metodo getLayerByCodTPN(codTPN) della classe territorio </li>
 * <li> recupero dell'istanza tramite il metodo statico del layer da recuperare con una chiamata del tipo LayerFarmacie.getInstance(ter); </li>
 * </ul>
 * 
 * @author Alessandro Radaelli
 *
 */
public class InitLayerPlugIn implements IInitLayerPlugin{
    
    public void init(Properties pr, ILayersManager layersManager) throws SITException{
       layersManager.initLayers(pr, LayerStates.defaultCodTPN, new LayerStates());    
       layersManager.initLayers(pr, LayerContinents.defaultCodTPN, new LayerContinents()); 
    }

    public PluginVersion getPluginVersion() throws SITException {
        return PluginVersion.getInstance();
    }
    
}