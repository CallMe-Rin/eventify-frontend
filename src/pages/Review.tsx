import { useAuth } from '@/hooks/useAuth';
import { useEvent } from '@/hooks/useEvents';
import { useCheckExistingReview, useCreateReview } from '@/hooks/useReviews';
import { useTransactions } from '@/hooks/useTransactions';
import { reviewFormSchema, type ReviewFormData } from '@/types/review';
import { Link, useNavigate, useParams } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  XCircle,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatEventDate } from '@/types/api';
import {
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/review/StarRating';
import Layout from '@/components/layout/Layout';

export default function ReviewFormPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();

  // Fetch event data
  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
  } = useEvent(eventId || '');

  // Fetch user transactions for this event
  const { transactions } = useTransactions({ eventId });

  // Find a completed transaction for this event
  const completedTransaction = transactions.find((tx) => tx.status === 'DONE');

  // Check if user already reviewed this event
  const { data: existingReview, isLoading: checkingReview } =
    useCheckExistingReview(eventId || '', user?.id || '');

  // Create review mutation
  const createReviewMutation = useCreateReview();

  // Form setup
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  // Check if event has passed
  const isEventPassed = event ? new Date(event.date) < new Date() : false;

  // Redirect if not authenticated or not a customer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast.info('Access Denied', {
        description: 'Please login to submit reviews.',
        position: 'bottom-right',
      });
    } else if (role !== 'CUSTOMER') {
      navigate('/');
      toast.warning('Access Denied', {
        description: 'Only customers can submit reviews.',
        position: 'bottom-right',
      });
    }
  }, [isAuthenticated, role, navigate]);

  // Handle form submission
  async function onSubmit(data: ReviewFormData) {
    if (!eventId || !completedTransaction) return;

    try {
      await createReviewMutation.mutateAsync({
        transactionId: completedTransaction.id,
        rating: data.rating,
        comment: data.comment.trim(),
      });

      toast.success('Review Submitted', {
        description: 'Thank you for your feedback!',
        position: 'bottom-right',
      });

      navigate(`/review/${eventId}`);
    } catch (error: any) {
      if (
        error?.response?.status === 409 ||
        error?.message?.includes('already exists')
      ) {
        toast.warning('Already Reviewed', {
          description: 'You have already submitted a review for this event.',
          position: 'bottom-right',
        });
        setTimeout(() => navigate('/transactions'), 1500);
      } else {
        toast.error('Submission Failed', {
          description:
            error instanceof Error
              ? error.message
              : 'Failed to submit review. Please try again.',
          position: 'bottom-right',
        });
      }
    }
  }

  // Loading state
  if (eventLoading || checkingReview) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container max-w-2xl mx-auto px-4 py-8">
            <Skeleton className="h-8 w-32 mb-6 bg-secondary" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-secondary" />
                <Skeleton className="h-4 w-64 mt-2 bg-secondary" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-24 w-full bg-secondary" />
                <Skeleton className="h-32 w-full bg-secondary" />
                <Skeleton className="h-10 w-full bg-secondary" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state - Event not found
  if (eventError || !event) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container max-w-2xl mx-auto px-4 py-8">
            <Link
              to="/transactions"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Transactions
            </Link>
            <Card className="border-destructive/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="text-destructive">
                  Event Not Found
                </CardTitle>
                <CardDescription className="text-base">
                  The event you're trying to review doesn't exist or has been
                  removed.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-2">
                <Button variant="outline" className="rounded-xl" asChild>
                  <Link to="/transactions">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Transactions
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // No completed transaction state
  if (!completedTransaction) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container max-w-2xl mx-auto px-4 py-8">
            <Link
              to="/transactions"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Transactions
            </Link>
            <Card className="border-amber-500/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-amber-600">
                  Cannot Submit Review
                </CardTitle>
                <CardDescription className="text-base">
                  You need a completed transaction for this event to write a
                  review.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-amber-500/30 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-900">
                    Requirements
                  </AlertTitle>
                  <AlertDescription className="text-amber-800">
                    Only users who have successfully attended the event can
                    submit reviews. Please complete your ticket purchase and
                    attend the event first.
                  </AlertDescription>
                </Alert>
                <div className="text-center">
                  <Button variant="outline" className="rounded-xl" asChild>
                    <Link to="/transactions">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      View My Transactions
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Already reviewed state
  if (existingReview) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container max-w-2xl mx-auto px-4 py-8">
            <Link
              to="/transactions"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Transactions
            </Link>
            <Card className="border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-primary">
                  Review Already Submitted
                </CardTitle>
                <CardDescription className="text-base">
                  You have already submitted a review for this event.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show existing review details */}
                <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{event.title}</h3>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < existingReview.rating
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {existingReview.comment && (
                    <p className="text-sm text-muted-foreground italic">
                      "{existingReview.comment}"
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Submitted on{' '}
                    {new Date(existingReview.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-center pt-2">
                  <Button className="rounded-2xl" asChild>
                    <Link to="/transactions">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Transactions
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Event hasn't passed yet
  if (!isEventPassed) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container max-w-2xl mx-auto px-4 py-8">
            <Link
              to="/transactions"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Transactions
            </Link>
            <Card className="border-blue-500/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">
                  Review Not Available Yet
                </CardTitle>
                <CardDescription className="text-base">
                  You can submit a review after the event has ended.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Event Date: {formatEventDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                <Alert className="border-blue-500/30 bg-blue-50">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-900">Coming Soon</AlertTitle>
                  <AlertDescription className="text-blue-800">
                    Reviews can only be submitted after the event has concluded.
                    Please check back after{' '}
                    <strong>{formatEventDate(event.date)}</strong> to share your
                    experience.
                  </AlertDescription>
                </Alert>

                <div className="text-center pt-2">
                  <Button variant="outline" className="rounded-xl" asChild>
                    <Link to="/transactions">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Return to Transactions
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Main review form (all conditions met)
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            to="/transactions"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Transactions
          </Link>

          {/* Review Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Write a Review
              </CardTitle>
              <CardDescription>
                Share your experience at this event
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Event Info */}
              <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Rating Field */}
                <Controller
                  control={form.control}
                  name="rating"
                  render={({ field, fieldState }) => (
                    <FieldGroup>
                      <Label className="font-medium">Rating</Label>
                      <div className="-mt-3 -mb-4">
                        <StarRating
                          value={field.value}
                          onChange={field.onChange}
                          size="lg"
                          disabled={createReviewMutation.isPending}
                        />
                      </div>
                      <FieldDescription>
                        Click on the stars to rate your experience
                      </FieldDescription>
                      <FieldError className="-mt-5">
                        {fieldState.error?.message}
                      </FieldError>
                    </FieldGroup>
                  )}
                />

                {/* Comment Field */}
                <Controller
                  control={form.control}
                  name="comment"
                  render={({ field, fieldState }) => (
                    <FieldGroup>
                      <Label className="-mb-4">Your Review</Label>
                      <Textarea
                        placeholder="Tell us about your experience at this event..."
                        className="min-h-[120px] resize-none rounded-xl -mb-5"
                        disabled={createReviewMutation.isPending}
                        {...field}
                      />
                      <FieldDescription>
                        Minimum 10 characters. Be specific about what you liked
                        or didn't like.
                      </FieldDescription>
                      <FieldError className="-mt-5">
                        {fieldState.error?.message}
                      </FieldError>
                    </FieldGroup>
                  )}
                />

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 rounded-xl hover:cursor-pointer"
                    disabled={createReviewMutation.isPending}
                  >
                    {createReviewMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/transactions')}
                    disabled={createReviewMutation.isPending}
                    className="rounded-xl hover:cursor-pointer hover:bg-destructive/20 hover:text-destructive hover:border-destructive/20"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
