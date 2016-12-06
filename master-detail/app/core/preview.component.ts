import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { PersonnelService } from '../personnel-manager/personnel.service';
import { Person } from '../personnel-manager/model';
import { ProjectService } from '../project-center/project.service';
import { Project } from '../project-center/model';
import { ColumnSetting, ColumnMap } from '../shared/layout.model';
@Component({
    selector: 'ct-preview',
    templateUrl: 'app/core/preview.component.html',
    styleUrls: ['app/core/preview.component.css']
})
export class PreviewComponent implements OnInit { 
    state: ActivatedRouteSnapshot;
    selectedRecord: any;
    settings: ColumnSetting[];
    valMaps: ColumnMap[];
    keys: {identifier: string, format: string}[];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private personnelService: PersonnelService,
        private projectService: ProjectService
    ){}

    ngOnInit(){
        this.router.events.subscribe((e) => {
            if (e.constructor.name === "NavigationEnd") {
                let snapshot: ActivatedRouteSnapshot; 
                let path: string; 
                let params: Params;
                
                snapshot = this.route.root.firstChild.snapshot;
                path = snapshot.url[0].path;
                params = snapshot.firstChild.params;
                
                if (params && params['id']) {
                    let id = +params['id'];
                    if (id) {
                        this.fetchData(path, id);
                    }
                }
            }
        });
        // Why doesn't this work? Seems like the way to achieve objective
        // and a better way than above solution
        // this.route.root.firstChild.url.subscribe( u => {
        //     this.featureUrl = u[0].path;
        // });
    }

    fetchData(path, id){
        if (path === 'personnel') {
            this.fetchFromService(this.personnelService, id);
        }
        if (path === 'projects') {
            this.fetchFromService(this.projectService, id);
        }
    }
    fetchFromService(service, id){
        let settings = service.settings;
        service.findOne(id).then( record => {
            let valMaps = settings.map( col => new ColumnMap(col));
            let keys = valMaps.map( val => {
                return { 
                            identifier: val.access(record),
                            format: val.format
                        };
            }); 
            this.selectedRecord = record;
            this.keys = keys;
        });
    }
    excludeIf(provided_key, exclude_target) {
        if (provided_key === exclude_target) {
            return false;
        }
        return true;
    }

}