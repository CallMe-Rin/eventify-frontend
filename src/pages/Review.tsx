import { useAuth } from '@/hooks/useAuth';
import { useEvent } from '@/hooks/useEvents';
import { useCheckExistingReview, useCreateReview } from '@/hooks/useReviews';
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
  Loader2,
  MapPin,
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
    } else if (role !== 'customer') {
      navigate('/');
      toast.warning('Access Denied', {
        description: 'Only customers can submit reviews.',
        position: 'bottom-right',
      });
    }
  }, [isAuthenticated, role, navigate]);

  // Handle form submission
  async function onSubmit(data: ReviewFormData) {
    if (!eventId || !user) return;

    try {
      await createReviewMutation.mutateAsync({
        eventId,
        userId: user.id,
        rating: data.rating,
        comment: data.comment.trim(),
      });

      toast.success('Review Submitted', {
        description: 'Thank you for your feedback!',
        position: 'bottom-right',
      });

      // Navigate back to transactions page
      navigate('/transactions');
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to submit review. Please try again.',
        position: 'bottom-right',
      });
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

  // Error state
  if (eventError || !event) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container max-w-2xl mx-auto px-4 py-8">
            <Link
              to="/transactions"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Transactions
            </Link>
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Event Not Found</AlertTitle>
              <AlertDescription>
                The event you're trying to review doesn't exist or has been
                removed.
              </AlertDescription>
            </Alert>
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
              to="/my-transactions"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Transactions
            </Link>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Already Reviewed</CardTitle>
                <CardDescription>
                  You have already submitted a review for this event.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="rounded-xl" asChild>
                  <Link to="/my-transactions">View My Transactions</Link>
                </Button>
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
        {' '}
        <div className="min-h-screen bg-background">
          <div className="container max-w-2xl mx-auto px-4 py-8">
            <Link
              to="/my-transactions"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Transactions
            </Link>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Review Not Available</AlertTitle>
              <AlertDescription>
                Reviews can only be submitted after the event has ended. This
                event is scheduled for {formatEventDate(event.date)}.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {' '}
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            to="/my-transactions"
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
                    onClick={() => navigate('/my-transactions')}
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
