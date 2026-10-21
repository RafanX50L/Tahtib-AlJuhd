"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_progress_controller_1 = require("../../Controller/client/client.progress.controller");
const client_progress_service_1 = require("../../Services/client/client.progress.service");
const Progress_repository_1 = require("../../Repository/Progress.repository");
const router = (0, express_1.Router)();
const controller = new client_progress_controller_1.ClientProgressController(new client_progress_service_1.ClientProgressService(new Progress_repository_1.ProgressRepository()));
router.post('/progress', controller.addEntry.bind(controller));
router.post('/progress/preview', controller.previewEntry.bind(controller));
router.get('/progress/current', controller.getCurrentStatus.bind(controller));
router.get('/progress/graph', controller.getGraphData.bind(controller));
exports.default = router;
//# sourceMappingURL=client.progress.routes.js.map