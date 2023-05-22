import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('turkeyCanvas', {static: false, read: ElementRef})
  private canvasRef!: ElementRef;

  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private cube!: Mesh;

  // Copied from here https://github.com/srivastavaanurag79/angular-three/blob/main/src/app/cube/cube.component.ts
  // Without wrapping the animation/rendering in the render() function, only a single frame would
  // be animated, so this is required for now.
  private startRenderingLoop() {
    let component: HomeComponent = this;
    (function render() {
      requestAnimationFrame(render);

      component.cube.rotation.x += 0.01;
      component.cube.rotation.y += 0.01;
      
      component.renderer.render(component.scene, component.camera);
    }());
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.scene = new Scene();
    this.scene.background = new Color(0, 0, 0);

    this.camera = new PerspectiveCamera(75, 1, 0.1, 2000);
    this.camera.position.z = 5;

    this.renderer = new WebGLRenderer({canvas: this.canvasRef.nativeElement});
    this.renderer.setSize(500, 500);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({color: new Color(255, 0, 0)});
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);

    this.startRenderingLoop();
  }
}
