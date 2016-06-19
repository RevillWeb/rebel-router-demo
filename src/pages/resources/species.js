/**
 * Created by Leon Revill on 07/03/16.
 * Blog: http://www.revilweb.com
 * GitHub: https://github.com/RevillWeb
 * Twitter: @RevillWeb
 */
import {ResourceItem} from "../resource-item.js";
export class SpeciesResource extends ResourceItem {
    createdCallback() {
        this.init("species");
    }
    render() {
        this.$stats.innerHTML = `
            <div class="stats-section">
                <div class="section">
                    <p><label><span class="icon icon-lips"></span></label> <span>${this.data.language}</span></p>
                </div>
                <div class="section">
                    <p><label><span class="icon icon-calendar5"></span></label> ${this.data.average_lifespan}</p>
                </div>
            </div>
            <div class="stats-section">
                <div class="section build">
                    <p><label>Av. Height:</label> ${this.data.average_height}</p>
                    <span class="icon icon-man"></span>
                    <p><label>Classification:</label> ${this.data.classification}</p>
                </div>
                <div class="section">
                    <p><label>Eye Colours:</label> ${this.data.eye_colors}</p>
                    <p><label>Hair Colours:</label> ${this.data.hair_colors}</p>
                    <p><label>Skin Colours:</label> ${this.data.skin_colors}</p>
                </div>
            </div>`;
    }
}

document.registerElement("species-resource", SpeciesResource);