
class Arm{ // Esse objeto usa elos ao invés de juntas, considerar a outra opção
    constructor(n, pos = base.copy()){
      this.pos = createVector(); // Posição da junta base
      this.pos.set(pos);
      this.links = []; // Conjunto de elos
      let position = pos;
      this.totalLen = 0; // Alcance máximo
      for(let i = 0; i < n; i++){
        let s = new Link(position);
        this.links.push(s);
        position.set(s.end);
        this.totalLen += s.len;
      }
      this.effector = this.links[n-1]; // Atuador do braço
    }
  
    // Configurar para que este objeto reuna os algoritmos de mais alto nível
    // e deixar os cálculos e funções de baixo nível para o objeto link
  
    display(){
      this.update();
      for(let s of this.links){
        s.display();
      }
    }
  
    update(){ 
      for(let i = 0; i < this.links.length; i++){
        this.links[i].update();
        if(i == this.links.length - 1) continue;
        this.links[i+1].pos.set(this.links[i].end);
      }
    }
  
    fabrik(objective){ // Forwards and Backwards Reaching Inverse Kinematics
      if(this.pos.dist(objective) > this.totalLen){
        console.log("Unreachable point");
        return;
      }
      while(this.effector.fwdPos.dist(objective) > .1){
        let fwdPoint = createVector();
        fwdPoint.set(objective.copy());
        for(let i = this.links.length - 1; i >= 0; i--){
          fwdPoint.set(this.links[i].forwards(fwdPoint));
        }
        fwdPoint.set(this.pos.copy());
        for(let j = 0; j < this.links.length; j++){
          fwdPoint.set(this.links[j].backwards(fwdPoint));
        }
      }
    }
  }
  