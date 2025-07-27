import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface OrdersTableProps {
  orders: any[];
  onUpdateStatus?: (orderId: string, status: string) => void;
  userType: 'farmer' | 'buyer';
}

const OrdersTable = ({ orders, onUpdateStatus, userType }: OrdersTableProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (orders.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No orders found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Crop</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>{userType === 'farmer' ? 'Buyer' : 'Farmer'}</TableHead>
            <TableHead>Date</TableHead>
            {userType === 'farmer' && onUpdateStatus && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">
                {order.id.slice(0, 8)}...
              </TableCell>
              <TableCell>{order.crop?.name}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>₹{Number(order.total_price).toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {userType === 'farmer' 
                      ? order.buyer?.full_name 
                      : order.farmer?.full_name
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {userType === 'farmer' 
                      ? order.buyer?.phone 
                      : order.farmer?.phone
                    }
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(order.created_at), 'PP')}
              </TableCell>
              {userType === 'farmer' && onUpdateStatus && (
                <TableCell>
                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(order.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onUpdateStatus(order.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {order.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(order.id, 'shipped')}
                    >
                      Mark Shipped
                    </Button>
                  )}
                  {order.status === 'shipped' && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(order.id, 'delivered')}
                    >
                      Mark Delivered
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;