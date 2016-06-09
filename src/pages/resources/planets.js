/**
 * Created by Leon Revill on 07/03/16.
 * Blog: http://www.revilweb.com
 * GitHub: https://github.com/RevillWeb
 * Twitter: @RevillWeb
 */
import {ResourceItem} from "../resource-item.js";
export class PlanetsResource extends ResourceItem {
    createdCallback() {
        this.init("planets");
    }
    render() {
        this.$stats.innerHTML = `
            <div class="stats-section">
                <div class="section">
                    <p><label><span class="icon icon-arrow-down16"></span></label> <span>${this.data.gravity}</span></p>
                </div>
                <div class="section">
                    <p><label><span class="icon icon-tree"></span></label> ${this.data.terrain}</p>
                </div>
            </div>
            <div class="stats-section">
                <div class="section build">
                    <p><label>Diameter:</label> ${this.data.diameter}</p>
                    <span class="icon icon-planet2"></span>
                    <p><label>Climate:</label> ${this.data.climate}</p>

                </div>
                <div class="section">
                <p><label>Population:</label> ${this.data.population}</p>
                    <p><label>Surface Water:</label> ${this.data.surface_water}</p>
                    <p><label>Orbital Period:</label> ${this.data.orbital_period}</p>
                    <p><label>Rotation Period:</label> ${this.data.rotation_period}</p>
                </div>
            </div>`;
    }
}