import { Router } from 'express';
import { getTypeChauffage } from '../controller/typeChauffageController';

const routerTypeChauffage = Router();

routerTypeChauffage.get('/:id', getTypeChauffage);

export default routerTypeChauffage;
