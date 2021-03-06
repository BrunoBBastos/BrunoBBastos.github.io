class Link{
    constructor(pos){
      this.pos = createVector(); // Posição da junta origem
      this.pos.set(pos.copy()); // Testar a necessidade da construção prévia à atribuição de valores
      this.ang = 0; // ângulo de rotação da junta base origem
      this.errAng = this.ang; // Erro de angulação
      this.len = 60; // Comprimento do elo
      
      this.end = createVector(this.pos.copy()); // Fim do elo / Ligação com a próxima junta
      this.end.set(p5.Vector.fromAngle(this.ang));
      this.end.mult(this.len);
      this.end.add(this.pos);
      // Vetores para projeção de transformações
      this.bckPos = createVector(); // Projeção sentido contrário
      this.fwdPos = createVector(); // Projeção avançada
      this.bckPos.set(this.pos.copy());
      this.fwdPos.set(this.end.copy());
  
      this.rotSpd = PI/12; // Rotação máxima por frame, incluir frame rate
    }
  
    forwards(pos){ // Projeta a posição das juntas em direção a pos objetivo
      this.fwdPos.set(pos.copy()); // projeta o fim do braço no objetivo
      let proj = p5.Vector.sub(this.bckPos, this.fwdPos); // traça uma linha entre objetivo e junta origem
      proj.setMag(this.len); // a linha é normalizada e multiplicada pelo tamanho do elo
      proj.add(this.fwdPos); // fim da linha projetado como posição da junta origem
      this.bckPos.set(proj);
      return this.bckPos;
    }
  
    backwards(pos){ // Projeta a posição das juntas de volta à base do braço
      this.bckPos.set(pos.copy()); //projeta a origem do braço de volta à base
      let proj = p5.Vector.sub(this.fwdPos, this.bckPos); // linha entre base e junta avançada
      proj.setMag(this.len); // ajuste do tamanho da linha
      proj.add(this.bckPos);
      this.fwdPos.set(proj.copy());
      // Calcular o ângulo de rotação das juntas que produz a pose desejada
      proj.sub(this.bckPos);
      let rotAng = proj.heading(); 
      let desiredRot, sig = 1;
      if(this.ang < 0) sig = -1;
      let alternRot = sig * 2 * PI + rotAng - this.ang;
      if(abs(rotAng - this.ang) < abs(alternRot)) desiredRot = rotAng - this.ang;
      else desiredRot = alternRot;
      
      this.errAng = desiredRot;
  
      return this.fwdPos;
    }
    
    update(){
      let error = constrain(this.errAng, -this.rotSpd, this.rotSpd);
      this.ang += error;
      this.errAng -= error;
  
      let proj = p5.Vector.fromAngle(this.ang);
      proj.setMag(this.len);
      proj.add(this.pos);
      this.end.set(proj);
    }
  
    display(){
      push();
      stroke(255);
      strokeWeight(5);
      line(this.pos.x, this.pos.y, this.end.x, this.end.y);
      strokeWeight(10);
      pop();
  
      if(debug){
        ellipse(this.bckPos.x, this.bckPos.y, 10);
        ellipse(this.fwdPos.x, this.fwdPos.y, 10);
      }
    }
  }
  