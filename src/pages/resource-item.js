/**
 * Created by Leon Revill on 07/03/16.
 * Blog: http://www.revilweb.com
 * GitHub: https://github.com/RevillWeb
 * Twitter: @RevillWeb
 */
class ResourceItem extends HTMLElement {
    connectedCallback() {
        console.log("RESOURCE TYPE:", this.type);
        this.baseUrl = "http://swapi.co/api/";
        this.id = this.getAttribute("id");
        this.data = {};
        this.innerHTML = `
            <rebel-loading id="loading" color="#ff6" background-color="#000"></rebel-loading>
            <a href="#" id="back-btn" is="rebel-back-a"><span class="icon icon-arrow-left2"></span> Back</a>
            <h1 id="title"></h1>
            <div id="stats"></div>
        `;
        this.$loader = this.querySelector('#loading');
        this.$stats = this.querySelector('#stats');
        this.getData();
        this._connected = true;
    }
    static get observedAttributes() { return ["id"]; }
    attributeChangedCallback(name, oldValue, newValue) {
        //This fires too early in IE11 - so just check to make sure we have initialised.
        if (this._connected === true && oldValue !== newValue) {
            if (value != null) {
                this.id = newValue;
                this.getData();
            }
        }
    }
    getData() {
        if (this.id !== null && this.type !== null) {
            this.$loader.show();
            let $title = this.querySelector("#title");
            let $back = this.querySelector("#back-btn");
            $back.setAttribute("href", "#/resources/" + this.type);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    try {
                        const json = JSON.parse(xhr.response);
                        $title.innerHTML = json.name;
                        this.data = json;
                        this.render();
                        this.$loader.hide();
                        $back.className = "back-btn show";
                    } catch (e) {
                        console.error("Couldn't parse API response:", e);
                    }
                }
            };
            xhr.open("GET", this.baseUrl + this.type + "/" + this.id);
            xhr.send();
        }
    }
}