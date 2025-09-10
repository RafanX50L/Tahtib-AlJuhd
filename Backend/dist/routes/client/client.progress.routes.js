"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_progress_controller_1 = require("../../Controller/client/client.progress.controller");
const client_progress_service_1 = require("../../Services/client/client.progress.service");
const router = (0, express_1.Router)();
const controller = new client_progress_controller_1.ClientProgressController(new client_progress_service_1.ClientProgressService());
// POST /progress
router.post('/progress', (req, res, next) => controller.addEntry(req, res, next));
// POST /progress/preview (no DB write)
router.post('/progress/preview', (req, res, next) => controller.previewEntry(req, res, next));
// GET /progress/current
router.get('/progress/current', (req, res, next) => controller.getCurrentStatus(req, res, next));
// GET /progress/graph?start=...&end=...
router.get('/progress/graph', (req, res, next) => controller.getGraphData(req, res, next));
exports.default = router;
//# sourceMappingURL=client.progress.routes.js.map