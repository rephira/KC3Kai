/* Database.js
KC3改 Indexed Database

Used to log player information for later use on Strategy Room
Uses Dexie.js third-party plugin on the assets directory
*/
(function(){
	"use strict";
	
	window.KC3Database = {
		index: 0,
		con:{},
		
		init :function( defaultUser ){
			this.con = new Dexie("KC3");
			
			if(typeof defaultUser !== "undefined"){
				this.index = defaultUser;
			}
			
			var
				// No upgrade flag (used in iteration)
				dbFirst = true,
				// No update function reference
				dbNonFunc = function(t){},
				// Initial State of Proposed Database, modified by every element on dbUpdates, ch and rm key.
				dbProposed = {},
				// DB Changes put in queue
				dbUpdates = [
					{
						ch: {
							account: "++id,&hq,server,mid,name",
							build: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
							lsc: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,devmat,result,time",
							sortie: "++id,hq,world,mapnum,fleetnum,combined,fleet1,fleet2,time",
							battle: "++id,hq,sortie_id,node,data,yasen,rating,drop,time",
							resource: "++id,hq,rsc1,rsc2,rsc3,rsc4,hour",
							useitem: "++id,hq,torch,screw,bucket,devmat,hour",
						},
						vr: 1,
					},
					{
						/* Actual Structure (compare with version 1)
							account: "++id,&hq,server,mid,name",
							build: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
							lsc: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,devmat,result,time",
							* sortie: "++id,hq,world,mapnum,fleetnum,combined,fleet1,fleet2,fleet3,fleet4,support1,support2,time",
							battle: "++id,hq,sortie_id,node,data,yasen,rating,drop,time",
							resource: "++id,hq,rsc1,rsc2,rsc3,rsc4,hour",
							useitem: "++id,hq,torch,screw,bucket,devmat,hour",
							* screenshots: "++id,hq,imgur,ltime",
						*/
						ch: {
							sortie: "++id,hq,world,mapnum,fleetnum,combined,fleet1,fleet2,fleet3,fleet4,support1,support2,time",
							screenshots: "++id,hq,imgur,ltime",
						},
						vr: 2,
					},
					{
						/* Actual Structure (compare with version 2)
							account: "++id,&hq,server,mid,name",
							build: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
							lsc: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,devmat,result,time",
							sortie: "++id,hq,world,mapnum,fleetnum,combined,fleet1,fleet2,fleet3,fleet4,support1,support2,time",
							battle: "++id,hq,sortie_id,node,data,yasen,rating,drop,time",
							resource: "++id,hq,rsc1,rsc2,rsc3,rsc4,hour",
							useitem: "++id,hq,torch,screw,bucket,devmat,hour",
							screenshots: "++id,hq,imgur,ltime",
							* develop: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time"
						*/
						ch: {
							develop: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
						},
						vr: 3,
					},
					{
						/* Actual Structure (compare with version 3)
							account: "++id,&hq,server,mid,name",
							build: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
							lsc: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,devmat,result,time",
							sortie: "++id,hq,world,mapnum,fleetnum,combined,fleet1,fleet2,fleet3,fleet4,support1,support2,time",
							* battle: "++id,hq,sortie_id,node,enemyId,data,yasen,rating,drop,time",
							resource: "++id,hq,rsc1,rsc2,rsc3,rsc4,hour",
							useitem: "++id,hq,torch,screw,bucket,devmat,hour",
							screenshots: "++id,hq,imgur,ltime",
							develop: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time"
						*/
						ch: {
							battle: "++id,hq,sortie_id,node,enemyId,data,yasen,rating,drop,time",
						},
						vr: 4,
					},
					{
						/* Actual Structure (compare with version 4)
							account: "++id,&hq,server,mid,name",
							build: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
							lsc: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,devmat,result,time",
							sortie: "++id,hq,world,mapnum,fleetnum,combined,fleet1,fleet2,fleet3,fleet4,support1,support2,time",
							battle: "++id,hq,sortie_id,node,enemyId,data,yasen,rating,drop,time",
							resource: "++id,hq,rsc1,rsc2,rsc3,rsc4,hour",
							useitem: "++id,hq,torch,screw,bucket,devmat,hour",
							screenshots: "++id,hq,imgur,ltime",
							develop: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
							* newsfeed: "++id,hq,type,message,time",
						*/
						ch: {
							newsfeed: "++id,hq,type,message,time",
						},
						vr: 5,
					},
					{
						/* Actual Structure (compare with version 5)
							account: "++id,&hq,server,mid,name",
							build: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
							lsc: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,devmat,result,time",
							sortie: "++id,hq,diff,world,mapnum,fleetnum,combined,fleet1,fleet2,fleet3,fleet4,support1,support2,time",
							battle: "++id,hq,sortie_id,node,enemyId,data,yasen,rating,drop,time",
							resource: "++id,hq,rsc1,rsc2,rsc3,rsc4,hour",
							useitem: "++id,hq,torch,screw,bucket,devmat,hour",
							screenshots: "++id,hq,imgur,ltime",
							develop: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
							newsfeed: "++id,hq,type,message,time",
						*/
						ch: {
							sortie: "++id,hq,diff,world,mapnum,fleetnum,combined,fleet1,fleet2,fleet3,fleet4,support1,support2,time",
						},
						vr: 6,
					},
					{
						ch: {
							battle: "++id,hq,sortie_id,node,enemyId,data,yasen,rating,drop,time,baseEXP,mvp",
							expedition: "++id,hq,data,mission,ships,equip,shipXP,admiralXP,items,time",
						},
						up: function(t){
							console.log("V6.5",t);
						},
						vr: 6.5,
					},
					{
						ch: {
							/** Expedition Alter Proposal
							Keys        DataType        Description
							(+)Fleet    Ships[6]        (Add) data that represents the current fleet (use sortie style, adaptable result)
							(-)Ships    integer[2][7]   (Rem) data that represents ship-level meaning
							(-)Equip    integer[5][7]   (Rem) data that represents ship equipment
							------------------------------------- **/
							expedition: "++id,hq,data,mission,fleet,shipXP,admiralXP,items,time",
							/** Naval Overall Proposal
							Keys        DataType        Description
							ID          PRIMARY-AUTOINC 
							HQ          char[8]         Describes the HQ ID of the admiral
							Hour        integer         Describes the UTC time, as standard of resources and consumables
							Type        char[10]        Representing the material/useitem change method
							Data        integer[8]      Changes that describes the current action
							------------------------------------- **/
							navaloverall: "++id,hq,hour,type,data",
						},
						up: function(self){
							// Upgrade Expedition Table
							self.expedition.toCollection().modify(function(mission){
								mission.fleet = [];
								mission.ships.shift();
								mission.equip = mission.equip || Array.apply(null,mission.ships)                      /** check expedition equipment, or */
									.map(function(x){return Array.apply(null,{length:5}).map(function(){return -1;})}); /*  generate empty equipment list */
								mission.equip.shift();
								mission.ships.forEach(function(x,i){
									/** data migrating process
									    ship master id, level, and equipment (if available)
									  will be transferred to the standard sortie json format.
									  any other data that remain unknown, are kept it's
									  unknownness.
									--------------------------------------------------------- */
									mission.fleet.push({
										mst_id: KC3ShipManager.get(x[0]).masterId,
										level: x[1],
										kyouka: Array.apply(null,{length:5}).map(function(){return '??';}),
										morale: '??',
										equip: mission.equip.shift()
									});
								});
								delete mission.equip;
								delete mission.ships;
							});
						},
						vr: 6.6,
					},
				];
				
			// Process the queue
			var self = this;
			$.each(dbUpdates, function(index, dbCurr){
				var dbVer;
				dbCurr = $.extend({ch:{},rm:[],up:dbNonFunc},dbCurr);
				
				// Replaces the proposed database table with the new one
				Object.keys(dbCurr.ch).forEach(function(k){
					dbProposed[k] = dbCurr.ch[k];
				});
				
				// Removes the unused database table
				dbCurr.rm.forEach(function(k){
					delete dbProposed[k];
				});
				
				// Apply Versioning
				dbVer = self.con.version(dbCurr.vr).stores(dbProposed);
				//console.log(dbCurr.vr,dbVer,Object.keys(dbProposed));
				if(dbFirst) {
					dbFirst = false;
				} else {
					dbVer.upgrade(dbCurr.up);
				}
			});
			this.con.open();
		},
		
		clear :function(callback){
			this.con.delete().then(callback);
		},
		
		Newsfeed: function(data){
			this.con.newsfeed.add({
				hq: this.index,
				type: data.type,
				message: data.message,
				time: data.time
			});
		},
		
		Player :function(data){
			var self = this;
			// check if account exists
			this.con.account
				.where("hq")
				.equals(this.index)
				.count(function(NumRecords){
					if(NumRecords === 0){
						// insert if not yet on db
						self.con.account.add({
							hq: self.index,
							server: data.server,
							mid: parseInt(data.mid, 10),
							name: data.name
						});
					}
				});
		},
		
		Build :function(data){
			data.hq = this.index;
			this.con.build.add(data);
		},
		
		LSC :function(data){
			data.hq = this.index;
			this.con.lsc.add(data);
		},
		
		Sortie :function(data, callback){
			data.hq = this.index;
			this.con.sortie.add(data).then(callback);
		},
		
		Battle :function(data){
			data.hq = this.index;
			this.con.battle.add(data);
		},
		
		Resource :function(data){
			data.hq = this.index;
			this.con.resource.add(data);
		},
		
		Useitem :function(data, stime){
			data.hq = this.index;
			this.con.useitem.add(data);
		},
		
		Screenshot :function(imgur){
			this.con.screenshots.add({
				hq : 0,
				imgur : imgur,
				ltime : Math.floor((new Date()).getTime()/1000),
			});
		},
		
		Develop :function(data){
			data.hq = this.index;
			this.con.develop.add(data);
		},
		
		Expedition :function(data){
			data.hq = this.index;
			this.con.expedition.add(data);
		},
		
		/* [GET] Retrive logs from Local DB
		--------------------------------------------*/
		get_build :function(pageNumber, callback){
			var itemsPerPage = 30;
			this.con.build
				.where("hq").equals(this.index)
				.reverse()
				.offset( (pageNumber-1)*itemsPerPage ).limit( itemsPerPage )
				.toArray(callback);
		},
		
		count_build: function(callback){
			this.con.build
				.where("hq").equals(this.index)
				.count(callback);
		},
		
		get_lscs :function(pageNumber, callback){
			var itemsPerPage = 30;
			this.con.lsc
				.where("hq").equals(this.index)
				.reverse()
				.offset( (pageNumber-1)*itemsPerPage ).limit( itemsPerPage )
				.toArray(callback);
		},
		
		count_lscs: function(callback){
			this.con.lsc
				.where("hq").equals(this.index)
				.count(callback);
		},
		
		count_normal_sorties: function(callback){
			this.con.sortie
				.where("hq").equals(this.index)
				.and(function(sortie){ return sortie.world < 10; })
				.count(callback);
		},
		
		get_normal_sorties :function(pageNumber, itemsPerPage, callback){
			var self = this;
			var sortieIds = [], bctr, sortieIndexed = {};
			
			this.con.sortie
				.where("hq").equals(this.index)
				.and(function(sortie){ return sortie.world < 10; })
				.reverse()
				.offset( (pageNumber-1)*itemsPerPage ).limit( itemsPerPage )
				.toArray(function(sortieList){
					// Compile all sortieIDs and indexify
					for(bctr in sortieList){
						sortieIds.push(sortieList[bctr].id);
						sortieIndexed["s"+sortieList[bctr].id] = sortieList[bctr];
						sortieIndexed["s"+sortieList[bctr].id].battles = [];
					}
					
					// Get all battles on those sorties
					self.con.battle
						.where("sortie_id").anyOf(sortieIds)
						.toArray(function(battleList){
							for(bctr in battleList){
								if(typeof sortieIndexed["s"+battleList[bctr].sortie_id] != "undefined"){
									sortieIndexed["s"+battleList[bctr].sortie_id].battles.push(battleList[bctr]);
								}else{
									console.error("orphan battle", battleList[bctr]);
								}
							}
							callback(sortieIndexed);
						});
				});
		},
		
		count_world :function(world, callback){
			this.con.sortie
				.where("hq").equals(this.index)
				.and(function(sortie){ return sortie.world == world; })
				.count(callback);
		},
		
		get_world :function(world, pageNumber, itemsPerPage, callback){
			var self = this;
			var sortieIds = [], bctr, sortieIndexed = {};
			
			this.con.sortie
				.where("hq").equals(this.index)
				.and(function(sortie){ return sortie.world==world; })
				.reverse()
				.offset( (pageNumber-1)*itemsPerPage ).limit( itemsPerPage )
				.toArray(function(sortieList){
					// Compile all sortieIDs and indexify
					for(bctr in sortieList){
						sortieIds.push(sortieList[bctr].id);
						sortieIndexed["s"+sortieList[bctr].id] = sortieList[bctr];
						sortieIndexed["s"+sortieList[bctr].id].battles = [];
					}
					
					// Get all battles on those sorties
					self.con.battle
						.where("sortie_id").anyOf(sortieIds)
						.toArray(function(battleList){
							for(bctr in battleList){
								if(typeof sortieIndexed["s"+battleList[bctr].sortie_id] != "undefined"){
									sortieIndexed["s"+battleList[bctr].sortie_id].battles.push(battleList[bctr]);
								}else{
									console.error("orphan battle", battleList[bctr]);
								}
							}
							callback(sortieIndexed);
						});
				});
		},
		
		count_map :function(world, map, callback){
			this.con.sortie
				.where("hq").equals(this.index)
				.and(function(sortie){ return sortie.world == world && sortie.mapnum==map; })
				.count(callback);
		},
		
		get_map :function(world, map, pageNumber, itemsPerPage, callback){
			var self = this;
			var sortieIds = [], bctr, sortieIndexed = {};
			
			this.con.sortie
				.where("hq").equals(this.index)
				.and(function(sortie){ return sortie.world==world && sortie.mapnum==map; })
				.reverse()
				.offset( (pageNumber-1)*itemsPerPage ).limit( itemsPerPage )
				.toArray(function(sortieList){
					// Compile all sortieIDs and indexify
					for(bctr in sortieList){
						sortieIds.push(sortieList[bctr].id);
						sortieIndexed["s"+sortieList[bctr].id] = sortieList[bctr];
						sortieIndexed["s"+sortieList[bctr].id].battles = [];
					}
					
					// Get all battles on those sorties
					self.con.battle
						.where("sortie_id").anyOf(sortieIds)
						.toArray(function(battleList){
							for(bctr in battleList){
								if(typeof sortieIndexed["s"+battleList[bctr].sortie_id] != "undefined"){
									sortieIndexed["s"+battleList[bctr].sortie_id].battles.push(battleList[bctr]);
								}else{
									console.error("orphan battle", battleList[bctr]);
								}
							}
							callback(sortieIndexed);
						});
				});
		},
		
		get_sortie :function( sortie_id, callback ){
			var self = this;
			this.con.sortie
				.where("id").equals(Number(sortie_id))
				.toArray(function(response){
					if(response.length > 0){
						callback(response[0]);
					}else{
						callback(false);
					}
				});
		},
		
		get_battle : function(mapArea, mapNo, battleNode, enemyId, callback) {
			var sortieIds = [];
			var bctr;
			
			var self = this;
			
			this.con.sortie
				.where("hq").equals(this.index)
				.and(function(sortie){ return sortie.world == mapArea && sortie.mapnum == mapNo; })
				.toArray(function(sortieList){
					// Compile all sortieIDs and indexify
					for( bctr in sortieList){
						sortieIds.push(sortieList[bctr].id);
					}
					
					var foundBattle;
					var callback2 = callback;
					// Get all battles on those sorties
					self.con.battle
						.where("sortie_id").anyOf(sortieIds)
						.toArray(function(battleList){
							
							for(bctr in battleList){
								if (battleList[bctr].enemyId == enemyId) {
									foundBattle = battleList[bctr];
									break;
								}
							}
							
							callback2(foundBattle);
						});
				});
		},
		
		getBattleById : function(battleId, callback) {
			this.con.battle
				.where("id").equals(Number(battleId))
				.toArray(function( ResultBattles ){
					if(ResultBattles.length > 0){
						callback( ResultBattles[0] );
					}else{
						callback(false);
					}
				});
		},
		
		get_enemy : function(enemyId, callback) {
			var self = this;
			this.con.battle
				.where("enemyId").equals(enemyId)
				.toArray(function(battleList){
					if(battleList.length > 0){
						battleList[0].data.api_ship_ke.splice(0, 1);
						callback({
							ids: battleList[0].data.api_ship_ke,
							formation: battleList[0].data.api_formation[1]
						});
					}else{
						callback(false);
					}
				});
		},
		
		get_resource :function(HourNow, callback){
			var self = this;
			this.con.resource
				.toArray(function(response){
					var callbackResponse = [];
					
					var ctr;
					for(ctr in response){
						if(response[ctr].hq == self.index){
							callbackResponse.push(response[ctr]);
						}
					}
					callback(callbackResponse);
				});
		},
		
		get_useitem :function(HourNow, callback){
			var self = this;
			this.con.useitem
				.toArray(function(response){
					var callbackResponse = [];
					
					var ctr;
					for(ctr in response){
						if(response[ctr].hq == self.index){
							callbackResponse.push(response[ctr]);
						}
					}
					
					callback(callbackResponse);
				});
		},
		
		get_devmt :function(pageNumber, callback){
			var itemsPerPage = 25;
			this.con.develop
				.where("hq").equals(this.index)
				.reverse()
				.offset( (pageNumber-1)*itemsPerPage ).limit( itemsPerPage )
				.toArray(callback);
		},
		
		count_devmt: function(callback){
			this.con.develop
				.where("hq").equals(this.index)
				.count(callback);
		},
		
		get_sortie_page :function( world, map, page, callback ){
			
		},
		
		request_export :function(callback){
			callback("{}");
		},
		
		count_screenshots: function(callback){
			this.con.screenshots.count(callback);
		},
		
		get_screenshots :function(pageNumber, callback){
			var itemsPerPage = 20;
			this.con.screenshots
				.reverse()
				.offset( (pageNumber-1)*itemsPerPage ).limit( itemsPerPage )
				.toArray(callback);
		},
		
	};
	
})();
