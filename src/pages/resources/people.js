/**
 * Created by Leon Revill on 07/03/16.
 * Blog: http://www.revilweb.com
 * GitHub: https://github.com/RevillWeb
 * Twitter: @RevillWeb
 */
// import {ResourceItem} from "../resource-item.js";
class PeopleResource extends ResourceItem {
    connectedCallback() {
        this.type = "people";
        super.connectedCallback();
    }
    render() {
        let genderIcon = "transgender-alt";
        if (this.data.gender == "male") {
            genderIcon = "male";
        } else if (this.data.gender == "female") {
            genderIcon = "female";
        }
        this.$stats.innerHTML = `
            <div class="stats-section">
                <div class="section">
                    <p><label><span class="icon icon-${genderIcon}"></span></label> <span>${this.data.gender}</span></p>
                </div>
                <div class="section">
                    <p><label><span class="icon icon-calendar5"></span></label> ${this.data.birth_year}</p>
                </div>
            </div>
            <div class="stats-section">
                <div class="section build">
                    <p><label>Height:</label> ${this.data.height}</p>
                    <span class="icon icon-man"></span>
                    <p><label>Mass:</label> ${this.data.mass}</p>
                </div>
                <div class="section">
                    <p><label>Eye Colour:</label> ${this.data.eye_color}</p>
                    <p><label>Hair Colour:</label> ${this.data.hair_color}</p>
                    <p><label>Skin Colour:</label> ${this.data.skin_color}</p>
                </div>
            </div>`;
    }
}

window.customElements.define("people-resource", PeopleResource);