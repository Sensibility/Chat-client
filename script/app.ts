import * as angular from 'angular';
import * as angularAnimate from 'angular-animate';
import * as angularMaterial from 'angular-material';
import * as sideBar from './sidebar/sidebar.component.ts';

import 'angular-material/angular-material.min.css';
import './app.scss';

export default angular.module('mainApp', [
	angularMaterial,
	angularAnimate
])
.component('sideBar', sideBar);
