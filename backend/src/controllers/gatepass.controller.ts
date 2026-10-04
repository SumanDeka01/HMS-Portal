import {Request, Response} from "express";
import gatePass from "../models/gatepass.model.js";

export const createGatePass = async (req: Request, res: Request) => {
    try {
        const {
            reason,
            destination, 
            outDate,
            expectedReturn,
            emergencyContanct
        } = req.body;

        if(
            !reason ||
            !destination||
            !outDate ||
            !expectedReturn ||
            !emergencyContanct
        ) {
            return res.status(400).json({
                message: "All fields are required to fill"
            });
        }

        const gatePass = await gatePass.create({
            studentId: req.user.id,
            reason,
            destination,
            outDate,
            expectedReturn,
            emergencyContanct
        })

        return res.status(200).json({
            message: "Gate pass application submitted",
            gatePass,
        })



    } catch (error) {
        console.error("Create Gate pass error", error);

        return res.status(500).json({
            message: "Internal server Error: GP"
        })
    }
}