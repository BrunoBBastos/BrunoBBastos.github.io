
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
      push();
      noFill();
      ellipse(this.pos.x, this.pos.y, this.totalLen * 2);
      pop();
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
        // Criar a opção de apontar na direção do ponto inválido
        console.log("Unreachable point");
        return;
      }
      let count = 0;
      while(this.effector.fwdPos.dist(objective) > .001){
        let fwdPoint = createVector();
        fwdPoint.set(objective.copy());
        for(let i = this.links.length - 1; i >= 0; i--){
          fwdPoint.set(this.links[i].forwards(fwdPoint));
        }
        fwdPoint.set(this.pos.copy());
        for(let j = 0; j < this.links.length; j++){
          fwdPoint.set(this.links[j].backwards(fwdPoint));
        }
        count++;
      }
      print(count);
    }
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  class Arm2{
    constructor(pos, nJoints, angle, linkLen){
      this.pos = pos.copy(); // Posição da base
      this.ang = angle; // Orientação da base
      this.joints = []; // Conjunto de juntas
      let p = createVector();
      p.set(this.pos.copy());
      this.totalLen = 0; // Comprimento total do braço
      for(let i = 0; i < nJoints; i++){
        let j = new Joint(p, linkLen * (i != nJoints -1)); // O linkLen da última junta deve(?) ser 0
        this.totalLen += j.linkLen;
        let nextPos = p5.Vector.fromAngle(this.ang);
        nextPos.setMag(linkLen);
        p.add(nextPos);
        this.joints.push(j);
      }

      this.tolerance = 0.01;
      this.debug = true;
    }

    fabrik(pt){ // F.orwards A.nd B.ackwards R.eaching I.nverse K.inematics
    //   // Checar se o ponto está ao alcance do braço
      if(this.pos.dist(pt) > this.totalLen){
        print("unreachable point!");
        return; // Implementar a opção de apontar para o ponto
      }
    //   // Enqt não for encontrada uma pose que alcance o ponto:
      let distance = this.joints[this.joints.length -1].proj.dist(pt); // Distância do manipulador ao ponto
      while(distance > this.tolerance)
      {// Projetar a posição de cada junta ao alcançar o ponto (forwards)
        let fwdProj = createVector();
        fwdProj.set(pt.copy());
        for(let j = this.joints.length -1; j >= 0; j--){ // Começando do manipulador
          this.joints[j].proj.set(fwdProj); // Não considera limites de rotação
          if(j == 0) continue;
          fwdProj.sub(this.joints[j-1].proj); // Cria a linha onde a próxima junta será projetada //////////// proj ou pos? Tem q resetar a projeção depois do processo ser concluído
          fwdProj.mult(-1); // Inverte a direção do vetor
          fwdProj.setMag(this.joints[j-1].linkLen); // Escala o vetor para o tamanho do elo anterior
          fwdProj.add(this.joints[j].proj); // Projeta a posição da próxima junta
        }
        // Retornar cada junta a uma posição possível (backwards)
        let bkwProj = createVector();
        bkwProj.set(this.pos.copy());
        for(let j = 0; j < this.joints.length; j++){
          this.joints[j].proj.set(bkwProj);
          if(j == this.joints.length -1) continue;
          bkwProj.sub(this.joints[j+1].proj);
          bkwProj.mult(-1);
          bkwProj.setMag(this.joints[j].linkLen);
          bkwProj.add(this.joints[j].proj);
        }
        distance = this.joints[this.joints.length -1].proj.dist(pt)
      }
      // console.log(distance);
      // Recolher a angulação de cada projeção
      let rotation = -this.ang - this.joints[0].ang; // Isso pelo menos sempre dá certo
      for(let j = 0; j < this.joints.length -1; j++){
        let proj = createVector();
        proj.set(this.joints[j+1].proj);
        proj.sub(this.joints[j].proj);
        this.joints[j].angError = rotation + proj.heading();
        rotation = -proj.heading();
      }

      /*
      01: 0       ==> proj (-PI/2) - angulo da base (-PI/2) 
      12: PI/2   ==> proj (0) -  proj do anterior (-PI/2)
      23: PI/2   ==> proj (PI/2) - proj do anterior (0)
       */
    }


    update(){
      for(let j of this.joints) j.updateRot();
      let jToJ = createVector();
      jToJ.set(this.pos.copy());
      let theta = this.ang;

      for(let j = 0; j < this.joints.length; j++){
        theta += this.joints[j].ang;
        this.joints[j].pos.set(jToJ);
        jToJ.add(p5.Vector.fromAngle(theta, this.joints[j].linkLen));
      }
    }

    display(){
    this.update();
      push();
      ellipseMode(CENTER);
      ellipseMode(RADIUS);
      noFill();
      stroke(255);
      let theta = this.ang; // Começar pela orietação da base do braço
      for(let j = 0; j < this.joints.length; j++){
        push();
        theta += this.joints[j].ang;
        translate(this.joints[j].pos);
        rotate(theta);
        ellipse(0, 0, 6);
        line(0, 0, this.joints[j].linkLen, 0);
        pop();
      }
      if(this.debug)
      {
        noFill();
        strokeWeight(2);
        stroke('red');
        ellipse(this.pos.x, this.pos.y, this.totalLen);
        for(let i = 0; i < this.joints.length; i++) ellipse(this.joints[i].proj.x, this.joints[i].proj.y, 7);
      }
      pop();

    }

    // readJointAngle(j){
    //   if(j == 0) return this.joints[0].ang;
    //   else if(j > 0 && j < this.joints.length) return this.joints[j].getRelativeAngle(this.joints[j-1].ang);
    //   else return null;
    // }

    /*
    Objetivos:
      Desenhar as juntas
      Função rotação própria de cada junta
    */
  }
  