package it.prato.comune.sit.plugin.demo.states;

import it.prato.comune.sit.LayerPoligoniTerritorio;
import it.prato.comune.sit.PoligonoTerritorio;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.List;

import org.opengis.feature.simple.SimpleFeature;

/**
 * Classe demo LayerContinents.
 * 
 * @author Tobia Di Pisa
 *
 */
public class PoligonoContinent extends PoligonoTerritorio {

	private static final long serialVersionUID = 1L;

	/**
	 * Costruttore di default della classe PoligonoState.
	 */
	public PoligonoContinent() {
		super();
	}

	/**
	 * Costruttore della classe PoligonoState.
	 * 
	 * @param logger
	 * @param layer
	 * @param Feat
	 */
	public PoligonoContinent(LogInterface logger, LayerPoligoniTerritorio layer, SimpleFeature Feat) {
		super(logger, layer, Feat);
	}

	public String getName() {
		return (String) getAttributeByNL(LayerContinents.NL_CONTINENTNAME);
	}

	public String getAbbr() {
		return (String) getAttributeByNL(LayerContinents.NL_CONTINENTNAME);
	}

	@Override
	public String getDescrizione() {
		//Sovrascrivere il metodo per personalizzare la descrizione dell'oggetto. Di default ritorna l'ID dell'oggetto.
		return this.getName();
	}

	@Override
	public List<String> getDescrizioneSuggest() {
		//Sovrascrivere il metodo per personalizzare la descrizione dell'oggetto utilizzata nella suggest. Di default ritorna l'ID dell'oggetto.
		return super.getDescrizioneSuggest();
	} 

}