
"use client";

import { useState, useEffect, useTransition } from "react";
import {
  getAllCallbackRequests,
  getAllMessageRequests,
  deleteCallbackRequest,
  deleteMessageRequest,
} from "@/lib/actions";
import { getExperienceById } from "@/lib/api";
import type { CallbackRequest, MessageRequest, ExperienceSummary } from "@/types";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Trash2, Edit, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type EnrichedCallbackRequest = CallbackRequest & { experienceTitle?: string };
type EnrichedMessageRequest = MessageRequest & { experienceTitle?: string };

async function enrichRequests<T extends CallbackRequest | MessageRequest>(requests: T[]): Promise<(T & { experienceTitle?: string })[]> {
    const enriched = await Promise.all(
        requests.map(async (req) => {
            const experience = await getExperienceById(req.experienceId);
            return {
                ...req,
                experienceTitle: experience?.title,
            };
        })
    );
    return enriched;
}

export default function AdminRequestsPage() {
  const [callbackRequests, setCallbackRequests] = useState<EnrichedCallbackRequest[]>([]);
  const [messageRequests, setMessageRequests] = useState<EnrichedMessageRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [callbackRes, messageRes] = await Promise.all([
        getAllCallbackRequests(),
        getAllMessageRequests(),
      ]);

      if (callbackRes.success && callbackRes.requests) {
        const enriched = await enrichRequests(callbackRes.requests);
        setCallbackRequests(enriched);
      }
      if (messageRes.success && messageRes.requests) {
        const enriched = await enrichRequests(messageRes.requests);
        setMessageRequests(enriched);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);
  
  const handleDeleteCallback = (id: string) => {
    startDeleteTransition(async () => {
        const result = await deleteCallbackRequest(id);
        if (result.success) {
            setCallbackRequests(prev => prev.filter(r => r.id !== id));
            toast({ title: "Success", description: "Callback request deleted." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    });
  }

  const handleDeleteMessage = (id: string) => {
    startDeleteTransition(async () => {
        const result = await deleteMessageRequest(id);
        if (result.success) {
            setMessageRequests(prev => prev.filter(r => r.id !== id));
            toast({ title: "Success", description: "Message request deleted." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    });
  }


  return (
    <Container className="py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mb-4">
                Admin Requests
            </h1>
            <p className="text-lg text-muted-foreground">
                Manage user inquiries for callbacks and messages.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <section>
                <h2 className="text-2xl font-bold font-headline mb-4">Callback Requests</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : callbackRequests.length === 0 ? (
                    <p className="text-muted-foreground">No callback requests found.</p>
                ) : (
                    <div className="space-y-4">
                        {callbackRequests.map(req => (
                            <Card key={req.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{req.name}</CardTitle>
                                    <CardDescription>{req.experienceTitle || `Experience ID: ${req.experienceId}`}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <p><strong>Email:</strong> {req.email}</p>
                                    <p><strong>Phone:</strong> {req.phone}</p>
                                    <p><strong>City:</strong> {req.city}</p>
                                    <p><strong>Travel Date:</strong> {format(new Date(req.dateOfTravel), 'PPP')}</p>
                                    <p><strong>Guests:</strong> {req.adults}A, {req.children}C, {req.infants}I</p>
                                    <p><strong>Query:</strong> {req.query}</p>
                                    <p><strong>Status:</strong> <span className="font-semibold">{req.status}</span></p>
                                </CardContent>
                                <CardFooter className="gap-2">
                                     <Button variant="outline" size="sm" onClick={() => toast({ title: "Edit action is not implemented."})}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm" disabled={isDeleting}>
                                                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteCallback(req.id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
            
            <section>
                <h2 className="text-2xl font-bold font-headline mb-4">Message Requests</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : messageRequests.length === 0 ? (
                    <p className="text-muted-foreground">No message requests found.</p>
                ) : (
                    <div className="space-y-4">
                        {messageRequests.map(req => (
                            <Card key={req.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{req.name}</CardTitle>
                                    <CardDescription>{req.experienceTitle || `Experience ID: ${req.experienceId}`}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <p><strong>Email:</strong> {req.email}</p>
                                    <p><strong>Phone:</strong> {req.phone}</p>
                                    <p><strong>Status:</strong> <span className="font-semibold">{req.status}</span></p>
                                </CardContent>
                                <CardFooter className="gap-2">
                                     <Button variant="outline" size="sm" onClick={() => toast({ title: "Edit action is not implemented."})}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="destructive" size="sm" disabled={isDeleting}>
                                                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteMessage(req.id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    </Container>
  );
}
