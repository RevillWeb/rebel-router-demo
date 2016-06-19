/**
 * Created by Leon Revill on 07/03/16.
 * Blog: http://www.revilweb.com
 * GitHub: https://github.com/RevillWeb
 * Twitter: @RevillWeb
 */
import {ResourceItem} from "../resource-item.js";
export class VehiclesResource extends ResourceItem {
    createdCallback() {
        this.init("vehicles");
    }
    render() {
        this.$stats.innerHTML = `
            <div class="stats-section">
                <div class="section">
                    <p><label><span class="icon icon-coins"></span></label> <span>${this.data.cost_in_credits}</span></p>
                </div>
                <div class="section">
                    <p><label><span class="icon icon-shield4"></span></label> ${this.data.vehicle_class}</p>
                </div>
            </div>
            <div class="stats-section">
                <div class="section build">
                    <p><label>Length:</label> ${this.data.length}</p>
                    <span class="icon icon-truck"></span>
                    <p><label>Cargo Capacity:</label> ${this.data.cargo_capacity}</p>
                    <p><label>Passengers:</label> ${this.data.passengers}</p>
                </div>
                <div class="section">
                    <p><label>Model:</label> ${this.data.model}</p>
                    <p><label>Crew:</label> ${this.data.crew}</p>
                    <p><label>Manufacturer:</label> <br />${this.data.manufacturer}</p>
                </div>
            </div>`;
    }
}

document.registerElement("vehicle-resource", VehiclesResource);